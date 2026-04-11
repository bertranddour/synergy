import { and, eq, gte, lt } from 'drizzle-orm'
import { Hono } from 'hono'
import { metrics, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'

const progressRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

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
    // Streak: single query fetching all completed session dates in last year, then calculate in JS
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    const allCompletedDates = await db
      .select({ completedAt: sessions.completedAt })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, oneYearAgo)))

    // Group by ISO week and count consecutive weeks backward
    const weekSet = new Set<string>()
    for (const s of allCompletedDates) {
      if (s.completedAt) {
        const d = new Date(s.completedAt)
        const dayOfWeek = d.getDay()
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        const monday = new Date(d)
        monday.setDate(d.getDate() + mondayOffset)
        weekSet.add(monday.toISOString().split('T')[0]!)
      }
    }

    let streakWeeks = 0
    const checkWeek = new Date(periodStart)
    for (let i = 0; i < 52; i++) {
      const weekKey = checkWeek.toISOString().split('T')[0]!
      if (weekSet.has(weekKey)) {
        streakWeeks++
        checkWeek.setDate(checkWeek.getDate() - 7)
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
    const rawLimit = Number(c.req.query('limit') ?? '12')
    const limit = Math.min(Math.max(rawLimit, 1), 52) // HI10: clamp 1-52

    const now = new Date()
    const weeksAgo = new Date(now.getTime() - limit * 7 * 24 * 60 * 60 * 1000)

    // Single query: fetch all completed sessions in the history range
    const allSessions = await db
      .select({ completedAt: sessions.completedAt })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, weeksAgo)))

    // Group by week in JS (single query instead of N queries)
    const weekCounts = new Map<string, number>()
    for (const s of allSessions) {
      if (s.completedAt) {
        const d = new Date(s.completedAt)
        const dayOfWeek = d.getDay()
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        const monday = new Date(d)
        monday.setDate(d.getDate() + mondayOffset)
        const key = monday.toISOString().split('T')[0]!
        weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1)
      }
    }

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

      const key = weekStart.toISOString().split('T')[0]!
      const modesCompleted = weekCounts.get(key) ?? 0

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
