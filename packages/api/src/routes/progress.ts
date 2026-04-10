import { and, eq, gte, lt } from 'drizzle-orm'
import { Hono } from 'hono'
import { metrics, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'

const progressRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

progressRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const now = new Date()
    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const periodStart = new Date(now)
    periodStart.setDate(now.getDate() + mondayOffset)
    periodStart.setHours(0, 0, 0, 0)

    const periodEnd = new Date(periodStart)
    periodEnd.setDate(periodStart.getDate() + 6)
    periodEnd.setHours(23, 59, 59, 999)

    // Completion: modes completed this period
    const completedThisPeriod = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, periodStart)))

    const modesCompleted = completedThisPeriod.length
    const modesTarget = 5
    const completionPercentage = Math.min(100, Math.round((modesCompleted / modesTarget) * 100))

    // Consistency: consecutive weeks with completions
    let streakWeeks = modesCompleted > 0 ? 1 : 0
    const checkDate = new Date(periodStart)
    checkDate.setDate(checkDate.getDate() - 7)

    for (let i = 0; i < 52; i++) {
      const weekEnd = new Date(checkDate)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const weekSessions = await db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, userId),
            eq(sessions.status, 'completed'),
            gte(sessions.completedAt, checkDate),
            lt(sessions.completedAt, weekEnd),
          ),
        )
        .limit(1)

      if (weekSessions.length > 0) {
        streakWeeks++
        checkDate.setDate(checkDate.getDate() - 7)
      } else {
        break
      }
    }

    // Growth: percentage of metrics that improved (current vs previous period)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const currentMetrics = await db
      .select()
      .from(metrics)
      .where(and(eq(metrics.userId, userId), gte(metrics.recordedAt, thirtyDaysAgo)))

    const previousMetrics = await db
      .select()
      .from(metrics)
      .where(
        and(eq(metrics.userId, userId), gte(metrics.recordedAt, sixtyDaysAgo), lt(metrics.recordedAt, thirtyDaysAgo)),
      )

    let growthScore = 0
    const improvingMetrics: string[] = []

    if (previousMetrics.length > 0 && currentMetrics.length > 0) {
      const currentByName = new Map<string, number>()
      const previousByName = new Map<string, number>()

      for (const m of currentMetrics) currentByName.set(m.name, m.value)
      for (const m of previousMetrics) previousByName.set(m.name, m.value)

      let improved = 0
      let total = 0
      for (const [name, currentVal] of currentByName) {
        const previousVal = previousByName.get(name)
        if (previousVal !== undefined) {
          total++
          if (currentVal > previousVal) {
            improved++
            improvingMetrics.push(name)
          }
        }
      }

      growthScore = total > 0 ? Math.round((improved / total) * 100) : 0
    }

    return c.json({
      completion: { value: modesCompleted, target: modesTarget, percentage: completionPercentage },
      consistency: { streakWeeks, lastActiveWeek: periodStart.toISOString().split('T')[0]! },
      growth: {
        score: growthScore,
        trend: growthScore > 50 ? 'improving' : growthScore > 0 ? 'stable' : ('stable' as const),
        improvingMetrics,
      },
      period: { start: periodStart.toISOString(), end: periodEnd.toISOString(), type: 'weekly' as const },
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

progressRoutes.get('/history', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)
    const limit = Number(c.req.query('limit') ?? '12')

    const now = new Date()
    const history: Array<{
      periodStart: string
      periodEnd: string
      completion: number
      consistency: number
      growth: number
      modesCompleted: number
    }> = []

    for (let week = 0; week < limit; week++) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (week + 1) * 7)
      const dayOfWeek = weekStart.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      weekStart.setDate(weekStart.getDate() + mondayOffset)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const weekSessions = await db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, userId),
            eq(sessions.status, 'completed'),
            gte(sessions.completedAt, weekStart),
            lt(sessions.completedAt, weekEnd),
          ),
        )

      const modesCompleted = weekSessions.length
      history.push({
        periodStart: weekStart.toISOString(),
        periodEnd: weekEnd.toISOString(),
        completion: Math.min(100, Math.round((modesCompleted / 5) * 100)),
        consistency: modesCompleted > 0 ? 1 : 0,
        growth: 0,
        modesCompleted,
      })
    }

    return c.json({ history: history.reverse() })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { progressRoutes }
