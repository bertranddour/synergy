import { and, desc, eq, gte } from 'drizzle-orm'
import { Hono } from 'hono'
import { assessments, frameworks, modes, proactiveObservations, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { resolveContent } from '../lib/i18n.js'

const activityRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

activityRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const locale = c.get('locale')
    const limit = Math.min(Number(c.req.query('limit') ?? 30), 100)
    const db = createDb(c.env.DB)

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

    // Fetch completed sessions (include mode translations)
    const recentSessions = await db
      .select({
        id: sessions.id,
        completedAt: sessions.completedAt,
        modeName: modes.name,
        modeSlug: modes.slug,
        modeTranslations: modes.translations,
        status: sessions.status,
      })
      .from(sessions)
      .innerJoin(modes, eq(sessions.modeId, modes.id))
      .where(
        and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, ninetyDaysAgo)),
      )
      .orderBy(desc(sessions.completedAt))
      .limit(limit)

    // Fetch completed assessments (include framework translations)
    const recentAssessments = await db
      .select({
        id: assessments.id,
        completedAt: assessments.completedAt,
        frameworkName: frameworks.name,
        frameworkTranslations: frameworks.translations,
        level: assessments.level,
        totalScore: assessments.totalScore,
      })
      .from(assessments)
      .innerJoin(frameworks, eq(assessments.frameworkId, frameworks.id))
      .where(
        and(
          eq(assessments.userId, userId),
          eq(assessments.status, 'completed'),
          gte(assessments.completedAt, ninetyDaysAgo),
        ),
      )
      .orderBy(desc(assessments.completedAt))
      .limit(limit)

    // Fetch acted-on observations
    const recentObservations = await db
      .select()
      .from(proactiveObservations)
      .where(
        and(
          eq(proactiveObservations.userId, userId),
          eq(proactiveObservations.actedOn, true),
          gte(proactiveObservations.createdAt, ninetyDaysAgo),
        ),
      )
      .orderBy(desc(proactiveObservations.createdAt))
      .limit(limit)

    // Merge into unified timeline
    type ActivityEvent = {
      type: 'session' | 'assessment' | 'observation'
      id: string
      title: string
      description: string
      timestamp: string
    }

    const events: ActivityEvent[] = [
      ...recentSessions.map((s) => {
        const resolvedMode = resolveContent(
          { name: s.modeName, slug: s.modeSlug, translations: s.modeTranslations },
          locale,
        )
        return {
          type: 'session' as const,
          id: s.id,
          title: resolvedMode.name,
          description: `Completed ${resolvedMode.name}`,
          timestamp: s.completedAt?.toISOString() ?? '',
        }
      }),
      ...recentAssessments.map((a) => {
        const resolvedFramework = resolveContent(
          { name: a.frameworkName, translations: a.frameworkTranslations },
          locale,
        )
        return {
          type: 'assessment' as const,
          id: a.id,
          title: `${resolvedFramework.name} Assessment`,
          description: `${a.level?.replace('-', ' ')} (${a.totalScore}/35)`,
          timestamp: a.completedAt?.toISOString() ?? '',
        }
      }),
      ...recentObservations.map((o) => ({
        type: 'observation' as const,
        id: o.id,
        title: o.title,
        description: o.triggerType.replace(/-/g, ' '),
        timestamp: o.createdAt.toISOString(),
      })),
    ]

    // Sort by timestamp descending
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return c.json({ events: events.slice(0, limit) })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { activityRoutes }
