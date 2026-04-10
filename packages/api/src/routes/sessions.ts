import {
  completeSessionSchema,
  createSessionSchema,
  sessionListQuerySchema,
  updateSessionFieldSchema,
} from '@synergy/shared'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { modes, sessions } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { recordSessionMetrics } from '../services/metrics.js'

const sessionRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Create Session ──────────────────────────────────────────────────────────

sessionRoutes.post('/', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const parsed = createSessionSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)

    const mode = await db.query.modes.findFirst({
      where: eq(modes.slug, parsed.data.modeSlug),
    })
    if (!mode) {
      return c.json({ error: 'Mode not found' }, 404)
    }

    const id = newId()
    const now = new Date()

    await db.insert(sessions).values({
      id,
      userId,
      teamId: parsed.data.teamId ?? null,
      modeId: mode.id,
      status: 'in_progress',
      fieldsData: {},
      currentFieldIndex: 0,
      startedAt: now,
    })

    const session = await db.query.sessions.findFirst({ where: eq(sessions.id, id) })

    return c.json(
      {
        session: formatSession(session!),
        mode: {
          id: mode.id,
          slug: mode.slug,
          name: mode.name,
          fieldsSchema: mode.fieldsSchema,
          aiCoachPrompts: mode.aiCoachPrompts,
          doneSignal: mode.doneSignal,
          timeEstimateMinutes: mode.timeEstimateMinutes,
        },
      },
      201,
    )
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Update Session Field (Progressive Save) ────────────────────────────────

sessionRoutes.patch('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const sessionId = c.req.param('id')
    const body = await c.req.json()
    const parsed = updateSessionFieldSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)

    const session = await db.query.sessions.findFirst({
      where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    })
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    if (session.status !== 'in_progress') {
      return c.json({ error: 'Session is not in progress' }, 400)
    }

    // Update fields data progressively
    const updatedFields = {
      ...session.fieldsData,
      [String(parsed.data.fieldIndex)]: parsed.data.fieldData,
    }

    await db
      .update(sessions)
      .set({
        fieldsData: updatedFields,
        currentFieldIndex: Math.max(session.currentFieldIndex, parsed.data.fieldIndex + 1),
      })
      .where(eq(sessions.id, sessionId))

    const updated = await db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) })

    return c.json({ session: formatSession(updated!) })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Complete Session ────────────────────────────────────────────────────────

sessionRoutes.post('/:id/complete', async (c) => {
  try {
    const userId = c.get('userId')
    const sessionId = c.req.param('id')
    const body = await c.req.json()
    const parsed = completeSessionSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)

    const session = await db.query.sessions.findFirst({
      where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    })
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    if (session.status !== 'in_progress') {
      return c.json({ error: 'Session is not in progress' }, 400)
    }

    const now = new Date()
    await db
      .update(sessions)
      .set({
        status: 'completed',
        decision: parsed.data.decision ?? null,
        completedAt: now,
      })
      .where(eq(sessions.id, sessionId))

    // Get mode for composability suggestions
    const mode = await db.query.modes.findFirst({ where: eq(modes.id, session.modeId) })

    const composabilitySuggestions = (mode?.composabilityHooks ?? [])
      .filter((h) => h.direction === 'feeds_into')
      .map((h) => ({
        modeSlug: h.modeSlug,
        reason: h.description,
      }))

    const completed = await db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) })

    // Record metrics
    const metricsUpdated = await recordSessionMetrics(db, {
      id: sessionId,
      userId,
      teamId: session.teamId,
      modeId: session.modeId,
      fieldsData: session.fieldsData,
      startedAt: session.startedAt,
      completedAt: now,
      decision: parsed.data.decision ?? null,
    })

    // Invalidate health cache
    await c.env.KV.delete(`health:${userId}`)

    return c.json({
      session: formatSession(completed!),
      metricsUpdated,
      composabilitySuggestions,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── List Sessions ───────────────────────────────────────────────────────────

sessionRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const query = sessionListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams))
    const params = query.success ? query.data : { limit: 20, offset: 0 }

    const conditions = [eq(sessions.userId, userId)]

    if (params.status) {
      conditions.push(eq(sessions.status, params.status))
    }

    const result = await db
      .select()
      .from(sessions)
      .where(and(...conditions))
      .orderBy(desc(sessions.startedAt))
      .limit(params.limit)
      .offset(params.offset)

    return c.json({
      sessions: result.map(formatSession),
      total: result.length,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Session Detail ──────────────────────────────────────────────────────

sessionRoutes.get('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const sessionId = c.req.param('id')
    const db = createDb(c.env.DB)

    const session = await db.query.sessions.findFirst({
      where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    })
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }

    const mode = await db.query.modes.findFirst({ where: eq(modes.id, session.modeId) })

    return c.json({
      session: formatSession(session),
      mode: mode
        ? {
            id: mode.id,
            slug: mode.slug,
            name: mode.name,
            fieldsSchema: mode.fieldsSchema,
            doneSignal: mode.doneSignal,
          }
        : null,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSession(s: typeof sessions.$inferSelect) {
  return {
    id: s.id,
    userId: s.userId,
    teamId: s.teamId,
    modeId: s.modeId,
    status: s.status,
    fieldsData: s.fieldsData,
    currentFieldIndex: s.currentFieldIndex,
    decision: s.decision,
    startedAt: s.startedAt.toISOString(),
    completedAt: s.completedAt?.toISOString() ?? null,
  }
}

export { sessionRoutes }
