import { activateFrameworkSchema, updateUserSchema } from '@synergy/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import {
  assessments,
  coachConversations,
  frameworks,
  metrics,
  proactiveObservations,
  progress,
  sessions,
  teamMembers,
  teams,
  userFrameworks,
  userPrograms,
  users,
} from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'

const userRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Get Profile ─────────────────────────────────────────────────────────────

userRoutes.get('/me', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const activeFrameworks = await db
      .select({
        slug: frameworks.slug,
        name: frameworks.name,
        active: userFrameworks.active,
        activatedAt: userFrameworks.activatedAt,
      })
      .from(userFrameworks)
      .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
      .where(eq(userFrameworks.userId, userId))

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        stage: user.stage,
        teamSize: user.teamSize,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      frameworks: activeFrameworks.map((f) => ({
        slug: f.slug,
        name: f.name,
        active: f.active,
        activatedAt: f.activatedAt?.toISOString() ?? null,
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Update Profile ──────────────────────────────────────────────────────────

userRoutes.patch('/me', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)
    await db
      .update(users)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(users.id, userId))

    const updated = await db.query.users.findFirst({ where: eq(users.id, userId) })
    if (!updated) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      stage: updated.stage,
      teamSize: updated.teamSize,
      onboardingCompleted: updated.onboardingCompleted,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── List Active Frameworks ──────────────────────────────────────────────────

userRoutes.get('/me/frameworks', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const result = await db
      .select({
        slug: frameworks.slug,
        name: frameworks.name,
        active: userFrameworks.active,
        activatedAt: userFrameworks.activatedAt,
      })
      .from(userFrameworks)
      .innerJoin(frameworks, eq(userFrameworks.frameworkId, frameworks.id))
      .where(eq(userFrameworks.userId, userId))

    return c.json({
      frameworks: result.map((f) => ({
        slug: f.slug,
        name: f.name,
        active: f.active,
        activatedAt: f.activatedAt?.toISOString() ?? null,
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Activate Framework ──────────────────────────────────────────────────────

userRoutes.post('/me/frameworks', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const parsed = activateFrameworkSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)

    // Find framework
    const framework = await db.query.frameworks.findFirst({
      where: eq(frameworks.slug, parsed.data.frameworkSlug),
    })
    if (!framework) {
      return c.json({ error: 'Framework not found' }, 404)
    }

    // Check if already activated
    const existing = await db.query.userFrameworks.findFirst({
      where: and(eq(userFrameworks.userId, userId), eq(userFrameworks.frameworkId, framework.id)),
    })

    if (existing) {
      // Reactivate if deactivated
      if (!existing.active) {
        await db
          .update(userFrameworks)
          .set({ active: true, activatedAt: new Date() })
          .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.frameworkId, framework.id)))
      }
    } else {
      await db.insert(userFrameworks).values({
        userId,
        frameworkId: framework.id,
        active: true,
        activatedAt: new Date(),
      })
    }

    return c.json({
      framework: {
        slug: framework.slug,
        name: framework.name,
      },
      modesUnlocked: framework.modeCount,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Deactivate Framework ────────────────────────────────────────────────────

userRoutes.delete('/me/frameworks/:slug', async (c) => {
  try {
    const userId = c.get('userId')
    const slug = c.req.param('slug') as 'core' | 'air' | 'max' | 'synergy'
    const db = createDb(c.env.DB)

    const framework = await db.query.frameworks.findFirst({
      where: eq(frameworks.slug, slug),
    })
    if (!framework) {
      return c.json({ error: 'Framework not found' }, 404)
    }

    await db
      .update(userFrameworks)
      .set({ active: false })
      .where(and(eq(userFrameworks.userId, userId), eq(userFrameworks.frameworkId, framework.id)))

    return c.json({ deactivated: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Export User Data (GDPR) ─────────────────────────────────────────────────

userRoutes.get('/me/export', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
    const userSessions = await db.select().from(sessions).where(eq(sessions.userId, userId))
    const userMetrics = await db.select().from(metrics).where(eq(metrics.userId, userId))
    const userAssessments = await db.select().from(assessments).where(eq(assessments.userId, userId))
    const userProgress = await db.select().from(progress).where(eq(progress.userId, userId))
    const userConversations = await db.select().from(coachConversations).where(eq(coachConversations.userId, userId))
    const userObservations = await db
      .select()
      .from(proactiveObservations)
      .where(eq(proactiveObservations.userId, userId))

    // Explicitly shape user data for export (no internal fields leak)
    const safeUser = user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          stage: user.stage,
          teamSize: user.teamSize,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }
      : null

    return c.json({
      user: safeUser,
      sessions: userSessions,
      metrics: userMetrics,
      assessments: userAssessments,
      progress: userProgress,
      conversations: userConversations,
      observations: userObservations,
      exportedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Delete Account (GDPR) ──────────────────────────────────────────────────

userRoutes.delete('/me', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    // Cascade delete all user data using D1 batch for atomicity
    await db.batch([
      db.delete(proactiveObservations).where(eq(proactiveObservations.userId, userId)),
      db.delete(coachConversations).where(eq(coachConversations.userId, userId)),
      db.delete(progress).where(eq(progress.userId, userId)),
      db.delete(metrics).where(eq(metrics.userId, userId)),
      db.delete(sessions).where(eq(sessions.userId, userId)),
      db.delete(assessments).where(eq(assessments.userId, userId)),
      db.delete(userFrameworks).where(eq(userFrameworks.userId, userId)),
      db.delete(teamMembers).where(eq(teamMembers.userId, userId)),
      db.delete(userPrograms).where(eq(userPrograms.userId, userId)),
      db.delete(teams).where(eq(teams.ownerId, userId)),
      db.delete(users).where(eq(users.id, userId)),
    ])

    // Delete KV session
    await c.env.KV.delete(`session:${userId}`)

    return c.json({
      deleted: true,
      dataRemoved: [
        'user',
        'sessions',
        'metrics',
        'assessments',
        'progress',
        'conversations',
        'observations',
        'frameworks',
        'team_memberships',
        'programs',
      ],
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { userRoutes }
