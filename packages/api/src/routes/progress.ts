import { and, eq, gte } from 'drizzle-orm'
import { Hono } from 'hono'
import { sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'

const progressRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Current Progress Rings ──────────────────────────────────────────────────

progressRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const db = createDb(c.env.DB)

  // Current period (this week: Monday to Sunday)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const periodStart = new Date(now)
  periodStart.setDate(now.getDate() + mondayOffset)
  periodStart.setHours(0, 0, 0, 0)

  const periodEnd = new Date(periodStart)
  periodEnd.setDate(periodStart.getDate() + 6)
  periodEnd.setHours(23, 59, 59, 999)

  // Count completed sessions this period
  const completedThisPeriod = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, periodStart)))

  const modesCompleted = completedThisPeriod.length
  const modesTarget = 5 // default recommendation
  const completionPercentage = Math.min(100, Math.round((modesCompleted / modesTarget) * 100))

  // Consistency streak: count consecutive weeks with at least 1 completion
  let streakWeeks = 0
  const checkDate = new Date(periodStart)
  checkDate.setDate(checkDate.getDate() - 7) // start from previous week

  for (let i = 0; i < 52; i++) {
    const weekStart = new Date(checkDate)
    const weekSessions = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, weekStart)))
      .limit(1)

    if (weekSessions.length > 0) {
      streakWeeks++
      checkDate.setDate(checkDate.getDate() - 7)
    } else {
      break
    }
  }

  // Include current week if they've done something
  if (modesCompleted > 0) {
    streakWeeks++
  }

  return c.json({
    completion: {
      value: modesCompleted,
      target: modesTarget,
      percentage: completionPercentage,
    },
    consistency: {
      streakWeeks,
      lastActiveWeek: periodStart.toISOString().split('T')[0]!,
    },
    growth: {
      score: 0, // Will be calculated when we have trend data
      trend: 'stable' as const,
      improvingMetrics: [],
    },
    period: {
      start: periodStart.toISOString(),
      end: periodEnd.toISOString(),
      type: 'weekly' as const,
    },
  })
})

// ─── Progress History ────────────────────────────────────────────────────────

progressRoutes.get('/history', async (c) => {
  return c.json({ history: [] })
})

export { progressRoutes }
