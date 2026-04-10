import { addMemberSchema, createTeamSchema } from '@synergy/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { teamMembers, teams, users } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { calculateHealth } from '../services/health.js'

const teamRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// ─── Create Team ─────────────────────────────────────────────────────────────

teamRoutes.post('/', async (c) => {
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
})

// ─── Get Team ────────────────────────────────────────────────────────────────

teamRoutes.get('/:id', async (c) => {
  const teamId = c.req.param('id')
  const db = createDb(c.env.DB)

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
})

// ─── Team Health ─────────────────────────────────────────────────────────────

teamRoutes.get('/:id/health', async (c) => {
  const teamId = c.req.param('id')
  const db = createDb(c.env.DB)

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
})

// ─── Add Member ──────────────────────────────────────────────────────────────

teamRoutes.post('/:id/members', async (c) => {
  const teamId = c.req.param('id')
  const body = await c.req.json()
  const parsed = addMemberSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
  }

  const db = createDb(c.env.DB)

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
})

// ─── Remove Member ───────────────────────────────────────────────────────────

teamRoutes.delete('/:id/members/:userId', async (c) => {
  const teamId = c.req.param('id')
  const memberUserId = c.req.param('userId')
  const db = createDb(c.env.DB)

  await db.delete(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, memberUserId)))

  return c.json({ removed: true })
})

export { teamRoutes }
