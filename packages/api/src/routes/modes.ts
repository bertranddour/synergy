import { Hono } from 'hono'
import { eq, and, inArray, desc } from 'drizzle-orm'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { modes, frameworks, userFrameworks, sessions } from '../db/schema.js'

const modeRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── List Modes ──────────────────────────────────────────────────────────────

modeRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  const frameworkFilter = c.req.query('framework') as 'core' | 'air' | 'max' | 'synergy' | undefined
  const search = c.req.query('search')

  // Get user's active frameworks
  const activeFrameworks = await db
    .select({ frameworkId: userFrameworks.frameworkId })
    .from(userFrameworks)
    .where(and(
      eq(userFrameworks.userId, userId),
      eq(userFrameworks.active, true),
    ))

  if (activeFrameworks.length === 0) {
    return c.json({ modes: [], total: 0 })
  }

  const activeFrameworkIds = activeFrameworks.map((f) => f.frameworkId)

  // Build query
  let query = db
    .select({
      id: modes.id,
      slug: modes.slug,
      name: modes.name,
      purpose: modes.purpose,
      flowName: modes.flowName,
      timeEstimateMinutes: modes.timeEstimateMinutes,
      sortOrder: modes.sortOrder,
      frameworkSlug: frameworks.slug,
      frameworkName: frameworks.name,
      frameworkColor: frameworks.color,
    })
    .from(modes)
    .innerJoin(frameworks, eq(modes.frameworkId, frameworks.id))
    .where(inArray(modes.frameworkId, activeFrameworkIds))
    .orderBy(modes.sortOrder)
    .$dynamic()

  // Apply framework filter
  if (frameworkFilter) {
    const fw = await db.query.frameworks.findFirst({
      where: eq(frameworks.slug, frameworkFilter),
    })
    if (fw) {
      query = query.where(eq(modes.frameworkId, fw.id))
    }
  }

  const result = await query

  // Apply search filter (client-side for simplicity with D1)
  let filtered = result
  if (search) {
    const term = search.toLowerCase()
    filtered = result.filter((m) =>
      m.name.toLowerCase().includes(term) ||
      m.purpose.toLowerCase().includes(term)
    )
  }

  return c.json({
    modes: filtered,
    total: filtered.length,
  })
})

// ─── Get Mode Detail ─────────────────────────────────────────────────────────

modeRoutes.get('/:slug', async (c) => {
  const userId = c.get('userId')
  const slug = c.req.param('slug')
  const db = createDb(c.env.DB)

  const mode = await db.query.modes.findFirst({
    where: eq(modes.slug, slug),
  })

  if (!mode) {
    return c.json({ error: 'Mode not found' }, 404)
  }

  // Get framework info
  const framework = await db.query.frameworks.findFirst({
    where: eq(frameworks.id, mode.frameworkId),
  })

  // Get recent sessions for this mode
  const recentSessions = await db
    .select({
      id: sessions.id,
      status: sessions.status,
      startedAt: sessions.startedAt,
      completedAt: sessions.completedAt,
    })
    .from(sessions)
    .where(and(
      eq(sessions.userId, userId),
      eq(sessions.modeId, mode.id),
    ))
    .orderBy(desc(sessions.startedAt))
    .limit(3)

  return c.json({
    mode: {
      id: mode.id,
      slug: mode.slug,
      name: mode.name,
      purpose: mode.purpose,
      trigger: mode.trigger,
      flowName: mode.flowName,
      fieldsSchema: mode.fieldsSchema,
      aiCoachPrompts: mode.aiCoachPrompts,
      doneSignal: mode.doneSignal,
      metricsSchema: mode.metricsSchema,
      composabilityHooks: mode.composabilityHooks,
      timeEstimateMinutes: mode.timeEstimateMinutes,
      framework: framework ? {
        slug: framework.slug,
        name: framework.name,
        color: framework.color,
      } : null,
    },
    recentSessions: recentSessions.map((s) => ({
      id: s.id,
      status: s.status,
      startedAt: s.startedAt.toISOString(),
      completedAt: s.completedAt?.toISOString() ?? null,
    })),
  })
})

export { modeRoutes }
