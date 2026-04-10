import type Anthropic from '@anthropic-ai/sdk'
import { and, eq, gte } from 'drizzle-orm'
import { PERSONALITY_PROMPT } from '../agents/alicia/prompts/personality.js'
import { frameworks, proactiveObservations, sessions, userFrameworks, users } from '../db/schema.js'
import type { Database } from '../lib/db.js'
import { newId } from '../lib/id.js'

interface TriggerResult {
  triggerType: 'stale-assumption' | 'procrastination' | 'health-decline' | 'framework-readiness' | 'missing-context'
  context: string
}

/**
 * Check all 5 proactive trigger conditions for a user.
 */
async function checkTriggers(db: Database, userId: string): Promise<TriggerResult[]> {
  const triggers: TriggerResult[] = []
  const now = new Date()

  // 1. Stale assumptions: no Validation Mode completion in >90 days
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const recentValidation = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, ninetyDaysAgo)))
    .limit(1)

  if (recentValidation.length === 0) {
    const totalSessions = await db.select().from(sessions).where(eq(sessions.userId, userId)).limit(1)
    if (totalSessions.length > 0) {
      triggers.push({
        triggerType: 'stale-assumption',
        context: 'No completed mode sessions in the last 90 days. Assumptions may be going untested.',
      })
    }
  }

  // 2. Procrastination: session started >7 days ago but not completed
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const staleSessions = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        eq(sessions.status, 'in_progress'),
        gte(sessions.startedAt, new Date(0)), // exists
      ),
    )

  const overdueSessions = staleSessions.filter((s) => s.startedAt < sevenDaysAgo)
  if (overdueSessions.length > 0) {
    triggers.push({
      triggerType: 'procrastination',
      context: `${overdueSessions.length} session(s) started more than 7 days ago but not completed.`,
    })
  }

  // 3. Health decline: any category dropped >15 points in 30 days
  const { calculateHealth } = await import('./health.js')
  const health = await calculateHealth(db, userId)
  for (const category of health.categories) {
    if (category.trend === 'declining' && category.trendPeriods >= 1) {
      triggers.push({
        triggerType: 'health-decline',
        context: `${category.name} health is declining — score dropped to ${category.score}/100.`,
      })
      break // Only report one declining category per check
    }
  }

  // 4. Missing context: no sessions at all
  const anySessions = await db.select().from(sessions).where(eq(sessions.userId, userId)).limit(1)
  if (anySessions.length === 0) {
    triggers.push({
      triggerType: 'missing-context',
      context: 'No mode sessions completed yet. Business context is not being tracked.',
    })
  }

  // 4. Framework readiness: user has >10 people but no Max framework
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (user && user.teamSize >= 10) {
    const activeFrameworkRows = await db
      .select({ slug: frameworks.slug })
      .from(userFrameworks)
      .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
      .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.active, true)))

    const activeSlugs = new Set(activeFrameworkRows.map((f) => f.slug))
    if (!activeSlugs.has('max') && user.teamSize >= 50) {
      triggers.push({
        triggerType: 'framework-readiness',
        context: `Team size is ${user.teamSize} but Max framework is not activated. Cross-team coordination may be suffering.`,
      })
    }
    if (!activeSlugs.has('air')) {
      triggers.push({
        triggerType: 'framework-readiness',
        context: `Team size is ${user.teamSize} but Air framework is not activated. Async communication patterns needed.`,
      })
    }
  }

  return triggers
}

/**
 * Generate proactive observations for a user using Claude.
 */
export async function generateProactiveObservations(
  db: Database,
  anthropic: Anthropic,
  userId: string,
): Promise<number> {
  // Check if there are already undismissed observations
  const existing = await db
    .select()
    .from(proactiveObservations)
    .where(and(eq(proactiveObservations.userId, userId), eq(proactiveObservations.dismissed, false)))
    .limit(5)

  if (existing.length >= 3) return 0 // Don't overwhelm

  const triggers = await checkTriggers(db, userId)
  if (triggers.length === 0) return 0

  let generated = 0

  for (const trigger of triggers.slice(0, 2)) {
    // Check if this trigger type already has an undismissed observation
    const alreadyExists = existing.some((o) => o.triggerType === trigger.triggerType)
    if (alreadyExists) continue

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: `${PERSONALITY_PROMPT}\n\nGenerate a brief proactive observation for the user's dashboard. 2-3 sentences max. Be specific and direct. End with a concrete action. Use Alicia's voice.`,
        messages: [
          {
            role: 'user',
            content: `Trigger: ${trigger.triggerType}\nContext: ${trigger.context}\n\nWrite a title (max 8 words) and a message (2-3 sentences) for this observation.`,
          },
        ],
      })

      const text = response.content[0]?.type === 'text' ? response.content[0].text : 'Check in on your business health.'

      // Parse title and message
      const lines = text.split('\n').filter((l) => l.trim())
      const title = lines[0]?.replace(/^(Title:|#|\*\*)/gi, '').trim() ?? 'Time for a check-in'
      const message =
        lines
          .slice(1)
          .join(' ')
          .replace(/^(Message:|Body:)/gi, '')
          .trim() || text

      await db.insert(proactiveObservations).values({
        id: newId(),
        userId,
        triggerType: trigger.triggerType,
        title: title.slice(0, 100),
        message: message.slice(0, 500),
        suggestedModeSlug: trigger.triggerType === 'stale-assumption' ? 'validation' : null,
        dismissed: false,
        actedOn: false,
        createdAt: new Date(),
      })

      generated++
    } catch {
      // Skip if Claude call fails — don't break the cron
      console.error(`Failed to generate observation for ${trigger.triggerType}`)
    }
  }

  return generated
}
