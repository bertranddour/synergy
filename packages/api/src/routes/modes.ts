import { and, desc, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { frameworks, modes, sessions, userFrameworks } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { resolveContent } from '../lib/i18n.js'

const modeRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

// ─── List Modes ──────────────────────────────────────────────────────────────

modeRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const locale = c.get('locale')
    const db = createDb(c.env.DB)

    const frameworkFilter = c.req.query('framework') as 'core' | 'air' | 'max' | 'synergy' | undefined
    const search = c.req.query('search')

    // Get user's active frameworks
    const activeFrameworks = await db
      .select({ frameworkId: userFrameworks.frameworkId })
      .from(userFrameworks)
      .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.active, true)))

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
        translations: modes.translations,
        frameworkSlug: frameworks.slug,
        frameworkName: frameworks.name,
        frameworkColor: frameworks.color,
        frameworkTranslations: frameworks.translations,
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

    // Resolve translations before filtering
    const resolved = result.map((row) => {
      const { translations: _mt, frameworkTranslations: _ft, ...rest } = row
      const modeResolved = resolveContent(
        { name: row.name, purpose: row.purpose, flowName: row.flowName, translations: row.translations },
        locale,
      )
      const fwResolved = resolveContent({ name: row.frameworkName, translations: row.frameworkTranslations }, locale)
      return {
        ...rest,
        name: modeResolved.name,
        purpose: modeResolved.purpose,
        flowName: modeResolved.flowName,
        frameworkName: fwResolved.name,
      }
    })

    // Apply search filter on translated values
    let filtered = resolved
    if (search) {
      const term = search.toLowerCase()
      filtered = resolved.filter((m) => m.name.toLowerCase().includes(term) || m.purpose.toLowerCase().includes(term))
    }

    return c.json({
      modes: filtered,
      total: filtered.length,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Mode Detail ─────────────────────────────────────────────────────────

modeRoutes.get('/:slug', async (c) => {
  try {
    const userId = c.get('userId')
    const locale = c.get('locale')
    const slug = c.req.param('slug')
    const db = createDb(c.env.DB)

    // Check KV cache first (1-hour TTL for mode specs — read-heavy, write-rare)
    const cacheKey = `mode:${slug}:${locale}`
    const cachedMode = await c.env.KV.get(cacheKey)

    let mode: typeof modes.$inferSelect | null = null
    if (cachedMode) {
      mode = JSON.parse(cachedMode) as typeof modes.$inferSelect
    } else {
      mode = (await db.query.modes.findFirst({ where: eq(modes.slug, slug) })) ?? null
      if (mode) {
        await c.env.KV.put(cacheKey, JSON.stringify(mode), { expirationTtl: 3600 })
      }
    }

    if (!mode) {
      return c.json({ error: 'Mode not found' }, 404)
    }

    // Resolve translations
    const resolvedMode = resolveContent(mode, locale)

    // Get framework info
    const framework = await db.query.frameworks.findFirst({
      where: eq(frameworks.id, mode.frameworkId),
    })
    const resolvedFramework = framework ? resolveContent(framework, locale) : null

    // Resolve mode names for composability hooks
    const hookSlugs = (resolvedMode.composabilityHooks ?? []).map((h) => h.modeSlug)
    let hookNameMap: Record<string, string> = {}
    if (hookSlugs.length > 0) {
      const hookModes = await db
        .select({ slug: modes.slug, name: modes.name, translations: modes.translations })
        .from(modes)
        .where(inArray(modes.slug, hookSlugs))
      hookNameMap = Object.fromEntries(
        hookModes.map((m) => {
          const resolved = resolveContent(m, locale)
          return [resolved.slug, resolved.name]
        }),
      )
    }

    // Get recent sessions for this mode
    const recentSessions = await db
      .select({
        id: sessions.id,
        status: sessions.status,
        startedAt: sessions.startedAt,
        completedAt: sessions.completedAt,
      })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.modeId, mode.id)))
      .orderBy(desc(sessions.startedAt))
      .limit(3)

    return c.json({
      mode: {
        id: resolvedMode.id,
        slug: resolvedMode.slug,
        name: resolvedMode.name,
        purpose: resolvedMode.purpose,
        trigger: resolvedMode.trigger,
        flowName: resolvedMode.flowName,
        fieldsSchema: resolvedMode.fieldsSchema,
        aiCoachPrompts: resolvedMode.aiCoachPrompts,
        doneSignal: resolvedMode.doneSignal,
        metricsSchema: resolvedMode.metricsSchema,
        composabilityHooks: (resolvedMode.composabilityHooks ?? []).map((h) => ({
          ...h,
          modeName: hookNameMap[h.modeSlug] ?? h.modeSlug,
        })),
        timeEstimateMinutes: resolvedMode.timeEstimateMinutes,
        framework: resolvedFramework
          ? {
              slug: resolvedFramework.slug,
              name: resolvedFramework.name,
              color: resolvedFramework.color,
            }
          : null,
      },
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        status: s.status,
        startedAt: s.startedAt.toISOString(),
        completedAt: s.completedAt?.toISOString() ?? null,
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { modeRoutes }
