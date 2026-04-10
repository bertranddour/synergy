import { Hono } from 'hono'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { calculateHealth } from '../services/health.js'

const healthRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Health Dashboard ────────────────────────────────────────────────────────

healthRoutes.get('/', async (c) => {
  const userId = c.get('userId')

  // Check KV cache first (5-min TTL)
  const cacheKey = `health:${userId}`
  const cached = await c.env.KV.get(cacheKey)
  if (cached) {
    return c.json(JSON.parse(cached))
  }

  const db = createDb(c.env.DB)
  const result = await calculateHealth(db, userId)

  // Cache for 5 minutes
  await c.env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 300 })

  return c.json(result)
})

// ─── Health Category Detail ──────────────────────────────────────────────────

healthRoutes.get('/:category', async (c) => {
  const userId = c.get('userId')
  const category = c.req.param('category')

  const db = createDb(c.env.DB)
  const health = await calculateHealth(db, userId)

  const categoryData = health.categories.find((cat) => cat.name === category)
  if (!categoryData) {
    return c.json({ error: 'Category not found' }, 404)
  }

  return c.json({
    category: categoryData.name,
    score: categoryData.score,
    trend: categoryData.trend,
    metrics: categoryData.topMetrics.map((m) => ({
      name: m.name,
      currentValue: m.value,
      previousValue: 0,
      unit: m.unit,
      trend: 'stable' as const,
      sparkline: [] as number[],
    })),
    recentSessions: [],
    recommendations: categoryData.recommendedModes,
  })
})

export { healthRoutes }
