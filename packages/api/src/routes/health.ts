import { and, desc, eq, gte, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { modes, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { resolveContent } from '../lib/i18n.js'
import { calculateHealth, getMetricSparkline } from '../services/health.js'

const healthRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

healthRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const locale = c.get('locale')

    const cacheKey = `health:${userId}:${locale}`
    const cached = await c.env.KV.get(cacheKey)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const db = createDb(c.env.DB)
    const result = await calculateHealth(db, userId)

    // Collect all recommended mode slugs across categories
    const allSlugs = [...new Set(result.categories.flatMap((cat) => cat.recommendedModes))]

    // Batch-fetch translated mode names
    const modeRows =
      allSlugs.length > 0
        ? await db
            .select({ slug: modes.slug, name: modes.name, translations: modes.translations })
            .from(modes)
            .where(inArray(modes.slug, allSlugs))
        : []
    const modeNameBySlug = new Map(
      modeRows.map((m) => {
        const resolved = resolveContent(m, locale)
        return [resolved.slug, resolved.name]
      }),
    )

    // Transform recommendedModes from string[] to { slug, name }[]
    const localized = {
      ...result,
      categories: result.categories.map((cat) => ({
        ...cat,
        recommendedModes: cat.recommendedModes.map((slug) => ({
          slug,
          name: modeNameBySlug.get(slug) ?? slug,
        })),
      })),
    }

    await c.env.KV.put(cacheKey, JSON.stringify(localized), { expirationTtl: 300 })

    return c.json(localized)
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

healthRoutes.get('/:category', async (c) => {
  try {
    const userId = c.get('userId')
    const locale = c.get('locale')
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

    // Get recent sessions for this category (include mode translations)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentCategorySessions = await db
      .select({
        id: sessions.id,
        completedAt: sessions.completedAt,
        modeSlug: modes.slug,
        modeName: modes.name,
        modeTranslations: modes.translations,
      })
      .from(sessions)
      .innerJoin(modes, eq(sessions.modeId, modes.id))
      .where(
        and(eq(sessions.userId, userId), eq(sessions.status, 'completed'), gte(sessions.completedAt, thirtyDaysAgo)),
      )
      .orderBy(desc(sessions.completedAt))
      .limit(5)

    // Resolve recommended mode names
    const recSlugs = categoryData.recommendedModes
    const recModeRows =
      recSlugs.length > 0
        ? await db
            .select({ slug: modes.slug, name: modes.name, translations: modes.translations })
            .from(modes)
            .where(inArray(modes.slug, recSlugs))
        : []
    const recNameBySlug = new Map(
      recModeRows.map((m) => {
        const resolved = resolveContent(m, locale)
        return [resolved.slug, resolved.name]
      }),
    )

    return c.json({
      category: categoryData.name,
      score: categoryData.score,
      trend: categoryData.trend,
      metrics: metricsWithSparklines,
      recentSessions: recentCategorySessions.map((s) => {
        const resolvedMode = resolveContent(
          { slug: s.modeSlug, name: s.modeName, translations: s.modeTranslations },
          locale,
        )
        return {
          id: s.id,
          modeSlug: s.modeSlug,
          modeName: resolvedMode.name,
          completedAt: s.completedAt?.toISOString() ?? '',
        }
      }),
      recommendations: recSlugs.map((slug) => ({
        slug,
        name: recNameBySlug.get(slug) ?? slug,
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { healthRoutes }
