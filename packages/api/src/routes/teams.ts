import { addMemberSchema, createTeamSchema } from '@synergy/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { teamMembers, teams, users } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { calculateHealth } from '../services/health.js'

const teamRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

/** Verify the authenticated user is a member of the team. Returns the membership or null. */
async function verifyTeamMembership(db: ReturnType<typeof createDb>, teamId: string, userId: string) {
  return db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
  })
}

/** Verify the authenticated user is a team lead. Returns the membership or null. */
async function verifyTeamLead(db: ReturnType<typeof createDb>, teamId: string, userId: string) {
  const membership = await verifyTeamMembership(db, teamId, userId)
  if (!membership || membership.role !== 'lead') return null
  return membership
}

// ─── List User's Teams ───────────────────────────────────────────────────────

teamRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const db = createDb(c.env.DB)

    const userTeams = await db
      .select({
        teamId: teamMembers.teamId,
        role: teamMembers.role,
        teamName: teams.name,
        teamType: teams.type,
        ownerId: teams.ownerId,
        createdAt: teams.createdAt,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId))

    return c.json({
      teams: userTeams.map((t) => ({
        id: t.teamId,
        name: t.teamName,
        type: t.teamType,
        role: t.role,
        ownerId: t.ownerId,
        createdAt: t.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Create Team ─────────────────────────────────────────────────────────────

teamRoutes.post('/', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const parsed = createTeamSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const db = createDb(c.env.DB)
    const id = newId()
    const now = new Date()

    await db.insert(teams).values({
      id,
      name: parsed.data.name,
      type: parsed.data.type,
      ownerId: userId,
      createdAt: now,
    })

    // Add creator as team lead
    await db.insert(teamMembers).values({
      teamId: id,
      userId,
      role: 'lead',
      joinedAt: now,
    })

    return c.json(
      {
        team: { id, name: parsed.data.name, type: parsed.data.type },
      },
      201,
    )
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Team ────────────────────────────────────────────────────────────────

teamRoutes.get('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const db = createDb(c.env.DB)

    const membership = await verifyTeamMembership(db, teamId, userId)
    if (!membership) return c.json({ error: 'Not a team member' }, 403)

    const team = await db.query.teams.findFirst({ where: eq(teams.id, teamId) })
    if (!team) return c.json({ error: 'Team not found' }, 404)

    const members = await db
      .select({
        userId: teamMembers.userId,
        role: teamMembers.role,
        joinedAt: teamMembers.joinedAt,
        name: users.name,
        email: users.email,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId))

    return c.json({
      team: {
        id: team.id,
        name: team.name,
        type: team.type,
        ownerId: team.ownerId,
        createdAt: team.createdAt.toISOString(),
      },
      members: members.map((m) => ({
        userId: m.userId,
        name: m.name,
        email: m.email,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Team Health ─────────────────────────────────────────────────────────────

teamRoutes.get('/:id/health', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const db = createDb(c.env.DB)

    const membership = await verifyTeamMembership(db, teamId, userId)
    if (!membership) return c.json({ error: 'Not a team member' }, 403)

    const members = await db
      .select({ userId: teamMembers.userId, name: users.name })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId))

    // Aggregate health across team members
    const memberHealths = await Promise.all(
      members.map(async (m) => {
        const health = await calculateHealth(db, m.userId)
        return { userId: m.userId, name: m.name, health }
      }),
    )

    // Average team scores per category
    const categoryScores = new Map<string, number[]>()
    for (const mh of memberHealths) {
      for (const cat of mh.health.categories) {
        const scores = categoryScores.get(cat.name) ?? []
        scores.push(cat.score)
        categoryScores.set(cat.name, scores)
      }
    }

    const teamHealth = Array.from(categoryScores.entries()).map(([name, scores]) => ({
      name,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      trend: 'stable' as const,
    }))

    return c.json({
      teamHealth,
      memberProgress: memberHealths.map((mh) => ({
        userId: mh.userId,
        name: mh.name,
        completion: 0,
        consistency: 0,
        growth: 0,
      })),
      teamMetrics: [],
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Add Member ──────────────────────────────────────────────────────────────

teamRoutes.post('/:id/members', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const db = createDb(c.env.DB)

    const leadCheck = await verifyTeamLead(db, teamId, userId)
    if (!leadCheck) return c.json({ error: 'Only team leads can add members' }, 403)

    const body = await c.req.json()
    const parsed = addMemberSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, parsed.data.email),
    })
    if (!user) return c.json({ error: 'User not found with that email' }, 404)

    // Check not already a member
    const existing = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id)),
    })
    if (existing) return c.json({ error: 'Already a member' }, 400)

    await db.insert(teamMembers).values({
      teamId,
      userId: user.id,
      role: parsed.data.role,
      joinedAt: new Date(),
    })

    return c.json({ added: true, userId: user.id })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Remove Member ───────────────────────────────────────────────────────────

teamRoutes.delete('/:id/members/:userId', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const memberUserId = c.req.param('userId')
    const db = createDb(c.env.DB)

    const leadCheck = await verifyTeamLead(db, teamId, userId)
    if (!leadCheck) return c.json({ error: 'Only team leads can remove members' }, 403)

    await db.delete(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, memberUserId)))

    return c.json({ removed: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { teamRoutes }
