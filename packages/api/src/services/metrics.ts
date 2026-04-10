import { eq } from 'drizzle-orm'
import { metrics, modes } from '../db/schema.js'
import type { Database } from '../lib/db.js'
import { newId } from '../lib/id.js'

/** Map mode categories to health categories */
const MODE_CATEGORY_MAP: Record<string, string> = {
  'fw-core': 'validation',
  'fw-air': 'team',
  'fw-max': 'scaling',
  'fw-synergy': 'ai-collaboration',
}

/** Operational modes that map to operational health */
const OPERATIONAL_MODES = new Set([
  'execution-tracker',
  'delivery-check',
  'priority-stack',
  'dashboard',
  'scaled-execution',
  'quality-matrix',
])

interface SessionForMetrics {
  id: string
  userId: string
  teamId: string | null
  modeId: string
  fieldsData: Record<string, unknown>
  startedAt: Date
  completedAt: Date | null
  decision: string | null
}

/**
 * Record metrics when a session completes.
 * Extracts metrics from the session's fields data based on the mode's metricsSchema.
 */
export async function recordSessionMetrics(
  db: Database,
  session: SessionForMetrics,
): Promise<Array<{ name: string; value: number; unit: string }>> {
  const mode = await db.query.modes.findFirst({
    where: eq(modes.id, session.modeId),
  })
  if (!mode) return []

  const now = new Date()
  const recorded: Array<{ name: string; value: number; unit: string }> = []

  // Determine health category
  type HealthCategory = 'validation' | 'operational' | 'team' | 'scaling' | 'ai-collaboration'
  let category: HealthCategory = (MODE_CATEGORY_MAP[mode.frameworkId] ?? 'validation') as HealthCategory
  if (OPERATIONAL_MODES.has(mode.slug)) {
    category = 'operational'
  }

  // Always record session completion as a metric
  recorded.push({ name: `${mode.slug}_completed`, value: 1, unit: 'count' })
  await db.insert(metrics).values({
    id: newId(),
    userId: session.userId,
    teamId: session.teamId,
    sessionId: session.id,
    category,
    name: `${mode.slug}_completed`,
    value: 1,
    unit: 'count',
    recordedAt: now,
  })

  // Record time-to-complete
  if (session.startedAt && session.completedAt) {
    const daysToComplete = Math.round(
      (session.completedAt.getTime() - session.startedAt.getTime()) / (1000 * 60 * 60 * 24),
    )
    recorded.push({ name: 'session_duration', value: daysToComplete, unit: 'days' })
    await db.insert(metrics).values({
      id: newId(),
      userId: session.userId,
      teamId: session.teamId,
      sessionId: session.id,
      category,
      name: 'session_duration',
      value: daysToComplete,
      unit: 'days',
      recordedAt: now,
    })
  }

  // Record mode-specific metrics from metricsSchema
  for (const metricDef of mode.metricsSchema) {
    let value = 0

    // Extract value based on extraction rule
    if (metricDef.extraction.includes('Increment by 1')) {
      value = 1
    } else if (
      metricDef.extraction.includes('session start to completion') &&
      session.startedAt &&
      session.completedAt
    ) {
      value = Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / (1000 * 60 * 60 * 24))
    } else if (metricDef.extraction.includes('Pivot') && session.decision) {
      value = session.decision === 'pivot' ? 100 : 0
    } else if (metricDef.extraction.includes('Completed') || metricDef.extraction.includes('per period')) {
      value = 1
    } else if (
      metricDef.extraction.includes('Coverage') ||
      metricDef.extraction.includes('rate') ||
      metricDef.extraction.includes('percentage')
    ) {
      // Estimate from field completion
      const fieldCount = Object.keys(session.fieldsData).length
      const totalFields = mode.fieldsSchema.length
      value = totalFields > 0 ? Math.round((fieldCount / totalFields) * 100) : 0
    } else {
      value = 1
    }

    recorded.push({ name: metricDef.name, value, unit: metricDef.unit })
    await db.insert(metrics).values({
      id: newId(),
      userId: session.userId,
      teamId: session.teamId,
      sessionId: session.id,
      category,
      name: metricDef.name,
      value,
      unit: metricDef.unit,
      recordedAt: now,
    })
  }

  return recorded
}
