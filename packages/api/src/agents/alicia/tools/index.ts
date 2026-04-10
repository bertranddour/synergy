import type Anthropic from '@anthropic-ai/sdk'
import { and, desc, eq } from 'drizzle-orm'
import { assessments, frameworks, modes, progress, sessions, userFrameworks, users } from '../../../db/schema.js'
import type { Database } from '../../../lib/db.js'
import { calculateHealth } from '../../../services/health.js'

/** Tool definitions for the Anthropic SDK */
export const ALICIA_TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: 'get_health_scores',
    description:
      "Get the user's current business health scores across all active categories (validation, operational, team, scaling, ai-collaboration). Returns scores 0-100, trends, and top metrics per category.",
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_recent_sessions',
    description: "Get the user's recent mode sessions. Shows which modes they ran, when, and decisions made.",
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: { type: 'number', description: 'Number of sessions to return (default 5)' },
      },
      required: [],
    },
  },
  {
    name: 'get_business_context',
    description: "Get the user's business context: stage, team size, active frameworks, onboarding status.",
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'suggest_mode',
    description: 'Get the best mode recommendation based on a specific weakness or health gap.',
    input_schema: {
      type: 'object' as const,
      properties: {
        weakness: { type: 'string', description: 'The health category or problem area to address' },
      },
      required: ['weakness'],
    },
  },
  {
    name: 'get_assessment_history',
    description: "Get the user's assessment history for a specific framework. Shows scores, levels, and progression.",
    input_schema: {
      type: 'object' as const,
      properties: {
        framework: { type: 'string', description: 'Framework slug: core, air, max, or synergy' },
      },
      required: ['framework'],
    },
  },
  {
    name: 'get_progress_rings',
    description:
      "Get the user's current progress ring values: completion percentage, consistency streak, and growth score.",
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'check_stale_assumptions',
    description:
      'Check for assumptions that have not been tested recently (>90 days since last Validation Mode session). Returns stale items with age in days.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
]

/** Execute a tool call and return the result */
export async function executeTool(
  db: Database,
  userId: string,
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<string> {
  switch (toolName) {
    case 'get_health_scores': {
      const health = await calculateHealth(db, userId)
      return JSON.stringify(health)
    }

    case 'get_recent_sessions': {
      const limit = (toolInput.limit as number) ?? 5
      const recentSessions = await db
        .select({
          id: sessions.id,
          status: sessions.status,
          decision: sessions.decision,
          startedAt: sessions.startedAt,
          completedAt: sessions.completedAt,
          modeName: modes.name,
          modeSlug: modes.slug,
          frameworkSlug: frameworks.slug,
        })
        .from(sessions)
        .innerJoin(modes, eq(sessions.modeId, modes.id))
        .innerJoin(frameworks, eq(modes.frameworkId, frameworks.id))
        .where(eq(sessions.userId, userId))
        .orderBy(desc(sessions.startedAt))
        .limit(limit)

      return JSON.stringify(
        recentSessions.map((s) => ({
          mode: s.modeName,
          modeSlug: s.modeSlug,
          framework: s.frameworkSlug,
          status: s.status,
          decision: s.decision,
          startedAt: s.startedAt.toISOString(),
          completedAt: s.completedAt?.toISOString() ?? null,
        })),
      )
    }

    case 'get_business_context': {
      const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
      if (!user) return JSON.stringify({ error: 'User not found' })

      const activeFrameworkRows = await db
        .select({ slug: frameworks.slug, name: frameworks.name })
        .from(userFrameworks)
        .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
        .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.active, true)))

      return JSON.stringify({
        stage: user.stage,
        teamSize: user.teamSize,
        onboardingCompleted: user.onboardingCompleted,
        activeFrameworks: activeFrameworkRows.map((f) => f.slug),
      })
    }

    case 'suggest_mode': {
      const weakness = toolInput.weakness as string
      const RECOMMENDATIONS: Record<string, string[]> = {
        validation: ['validation', 'insight-capture', 'business-engine'],
        operational: ['execution-tracker', 'delivery-check', 'priority-stack'],
        team: ['team-rhythm', 'package', 'async-decision'],
        scaling: ['connection-map', 'company-priority', 'org-map'],
        'ai-collaboration': ['ai-onboarding', 'centaur-assessment', 'trust-calibration'],
      }
      const suggested = RECOMMENDATIONS[weakness] ?? ['validation']
      const modeDetails = await db
        .select({
          slug: modes.slug,
          name: modes.name,
          purpose: modes.purpose,
          timeEstimateMinutes: modes.timeEstimateMinutes,
        })
        .from(modes)
        .where(eq(modes.slug, suggested[0]!))

      return JSON.stringify(modeDetails[0] ?? { slug: suggested[0], suggestion: `Run a ${weakness} mode` })
    }

    case 'get_assessment_history': {
      const fwSlug = toolInput.framework as 'core' | 'air' | 'max' | 'synergy'
      const fw = await db.query.frameworks.findFirst({ where: eq(frameworks.slug, fwSlug) })
      if (!fw) return JSON.stringify({ error: 'Framework not found' })

      const history = await db
        .select()
        .from(assessments)
        .where(and(eq(assessments.userId, userId), eq(assessments.frameworkId, fw.id)))
        .orderBy(desc(assessments.completedAt))
        .limit(5)

      return JSON.stringify(
        history.map((a) => ({
          status: a.status,
          totalScore: a.totalScore,
          maxScore: a.maxScore,
          level: a.level,
          completedAt: a.completedAt?.toISOString() ?? null,
        })),
      )
    }

    case 'get_progress_rings': {
      const latest = await db.query.progress.findFirst({
        where: eq(progress.userId, userId),
      })
      if (!latest) return JSON.stringify({ completion: 0, consistency: 0, growth: 0 })

      return JSON.stringify({
        completion: latest.completionRing,
        consistencyStreak: latest.consistencyStreak,
        growth: latest.growthScore,
        modesCompletedThisPeriod: latest.modesCompletedThisPeriod,
        modesRecommendedThisPeriod: latest.modesRecommendedThisPeriod,
      })
    }

    case 'check_stale_assumptions': {
      // Find the most recent Validation Mode completion
      const validationMode = await db.query.modes.findFirst({
        where: eq(modes.slug, 'validation'),
      })

      if (!validationMode) {
        return JSON.stringify({ stale: true, message: 'No Validation Mode found in database.' })
      }

      const recentValidation = await db
        .select({
          id: sessions.id,
          completedAt: sessions.completedAt,
          fieldsData: sessions.fieldsData,
        })
        .from(sessions)
        .where(
          and(eq(sessions.userId, userId), eq(sessions.modeId, validationMode.id), eq(sessions.status, 'completed')),
        )
        .orderBy(desc(sessions.completedAt))
        .limit(5)

      if (recentValidation.length === 0) {
        return JSON.stringify({
          stale: true,
          daysSinceLastValidation: null,
          message: 'No Validation Mode sessions completed ever. Assumptions are untested.',
        })
      }

      const lastValidation = recentValidation[0]!
      const daysSince = lastValidation.completedAt
        ? Math.round((Date.now() - lastValidation.completedAt.getTime()) / (1000 * 60 * 60 * 24))
        : null

      const isStale = daysSince === null || daysSince > 90

      return JSON.stringify({
        stale: isStale,
        daysSinceLastValidation: daysSince,
        recentValidations: recentValidation.length,
        message: isStale
          ? `Last validation was ${daysSince ?? 'never'} days ago. Assumptions may be outdated.`
          : `Last validation was ${daysSince} days ago. Looking good.`,
      })
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` })
  }
}
