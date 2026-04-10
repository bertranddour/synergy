import { and, desc, eq, gte } from 'drizzle-orm'
import { Hono } from 'hono'
import { modes, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { calculateHealth, getMetricSparkline } from '../services/health.js'

const healthRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

healthRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')

    const cacheKey = `health:${userId}`
    const cached = await c.env.KV.get(cacheKey)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const db = createDb(c.env.DB)
    const result = await calculateHealth(db, userId)

    await c.env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 300 })

    return c.json(result)
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

healthRoutes.get('/:category', async (c) => {
  try {
    const userId = c.get('userId')
    const category = c.req.param('category')
    const db = createDb(c.env.DB)

    const health = await calculateHealth(db, userId)
    const categoryData = health.categories.find((cat) => cat.name === category)
    if (!categoryData) {
      return c.json({ error: 'Category not found' }, 404)
    }

    // Get sparklines for each metric
    const metricsWithSparklines = await Promise.all(
      categoryData.topMetrics.map(async (m) => {
        const sparkline = await getMetricSparkline(db, userId, m.name)
        return {
          name: m.name,
          currentValue: m.value,
          previousValue: 0,
          unit: m.unit,
          trend: categoryData.trend,
          sparkline,
        }
      }),
    )

    // Get recent sessions for this category
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentCategorySessions = await db
      .select({ id: sessions.id, completedAt: sessions.completedAt, modeSlug: modes.slug })
      .from(sessions)
      .innerJoin(modes, eq(sessions.modeId, modes.id))
      .where(
        and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, thirtyDaysAgo)),
      )
      .orderBy(desc(sessions.completedAt))
      .limit(5)

    return c.json({
      category: categoryData.name,
      score: categoryData.score,
      trend: categoryData.trend,
      metrics: metricsWithSparklines,
      recentSessions: recentCategorySessions.map((s) => ({
        id: s.id,
        modeSlug: s.modeSlug,
        completedAt: s.completedAt?.toISOString() ?? '',
      })),
      recommendations: categoryData.recommendedModes,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { healthRoutes }
