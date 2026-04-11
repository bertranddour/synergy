import { createTeamSchema, inviteMemberSchema } from '@synergy/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { teamInvitations, teamMembers, teams, users } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'
import { sendTeamInviteEmail } from '../lib/email.js'
import { newId } from '../lib/id.js'
import { calculateHealth } from '../services/health.js'

const teamRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

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

// ─── Send Invitation ────────────────────────────────────────────────────────

teamRoutes.post('/:id/invitations', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const db = createDb(c.env.DB)

    const leadCheck = await verifyTeamLead(db, teamId, userId)
    if (!leadCheck) return c.json({ error: 'Only team leads can invite members' }, 403)

    const body = await c.req.json()
    const parsed = inviteMemberSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid data', details: parsed.error.flatten() }, 400)
    }

    const email = parsed.data.email.toLowerCase()

    // Self-invite check
    const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) })
    if (currentUser && currentUser.email.toLowerCase() === email) {
      return c.json({ error: 'Cannot invite yourself' }, 400)
    }

    // Already-member check
    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) })
    if (existingUser) {
      const existingMember = await db.query.teamMembers.findFirst({
        where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, existingUser.id)),
      })
      if (existingMember) return c.json({ error: 'Already a team member' }, 400)
    }

    // Duplicate pending check
    const pendingInvite = await db.query.teamInvitations.findFirst({
      where: and(
        eq(teamInvitations.teamId, teamId),
        eq(teamInvitations.email, email),
        eq(teamInvitations.status, 'pending'),
      ),
    })
    if (pendingInvite) return c.json({ error: 'Invitation already pending' }, 400)

    // Get team name + inviter name for email
    const team = await db.query.teams.findFirst({ where: eq(teams.id, teamId) })
    if (!team) return c.json({ error: 'Team not found' }, 404)
    const inviterName = currentUser?.name ?? 'A team lead'

    // Build invite URL
    const token = nanoid(42)
    const baseUrl =
      c.env.ENVIRONMENT === 'development' ? 'http://localhost:5173/invite' : 'https://synergy.7flows.com/invite'
    const inviteUrl = `${baseUrl}?token=${token}`

    // Send email first — if it fails, no orphan DB row
    await sendTeamInviteEmail(c.env, email, inviterName, team.name, inviteUrl)

    // Create invitation record
    const invitationId = newId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    await db.insert(teamInvitations).values({
      id: invitationId,
      teamId,
      email,
      role: parsed.data.role,
      invitedBy: userId,
      status: 'pending',
      token,
      createdAt: now,
      expiresAt,
    })

    // Store in KV for fast token lookup
    await c.env.KV.put(`invite:${token}`, JSON.stringify({ invitationId, teamId, email }), {
      expirationTtl: 7 * 24 * 60 * 60,
    })

    return c.json({ sent: true, invitationId }, 201)
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── List Pending Invitations ───────────────────────────────────────────────

teamRoutes.get('/:id/invitations', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const db = createDb(c.env.DB)

    const membership = await verifyTeamMembership(db, teamId, userId)
    if (!membership) return c.json({ error: 'Not a team member' }, 403)

    const now = new Date()
    const invitations = await db
      .select({
        id: teamInvitations.id,
        email: teamInvitations.email,
        role: teamInvitations.role,
        invitedBy: teamInvitations.invitedBy,
        inviterName: users.name,
        createdAt: teamInvitations.createdAt,
        expiresAt: teamInvitations.expiresAt,
      })
      .from(teamInvitations)
      .innerJoin(users, eq(teamInvitations.invitedBy, users.id))
      .where(and(eq(teamInvitations.teamId, teamId), eq(teamInvitations.status, 'pending')))

    // Filter expired
    const pending = invitations
      .filter((inv) => inv.expiresAt > now)
      .map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        inviterName: inv.inviterName,
        createdAt: inv.createdAt.toISOString(),
        expiresAt: inv.expiresAt.toISOString(),
      }))

    return c.json({ invitations: pending })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Revoke Invitation ──────────────────────────────────────────────────────

teamRoutes.delete('/:id/invitations/:inviteId', async (c) => {
  try {
    const userId = c.get('userId')
    const teamId = c.req.param('id')
    const inviteId = c.req.param('inviteId')
    const db = createDb(c.env.DB)

    const leadCheck = await verifyTeamLead(db, teamId, userId)
    if (!leadCheck) return c.json({ error: 'Only team leads can revoke invitations' }, 403)

    const invitation = await db.query.teamInvitations.findFirst({
      where: and(eq(teamInvitations.id, inviteId), eq(teamInvitations.teamId, teamId)),
    })
    if (!invitation) return c.json({ error: 'Invitation not found' }, 404)
    if (invitation.status !== 'pending') return c.json({ error: 'Invitation is not pending' }, 400)

    await db.update(teamInvitations).set({ status: 'revoked' }).where(eq(teamInvitations.id, inviteId))

    await c.env.KV.delete(`invite:${invitation.token}`)

    return c.json({ revoked: true })
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

    // Cannot remove team owner
    const team = await db.query.teams.findFirst({ where: eq(teams.id, teamId) })
    if (team && memberUserId === team.ownerId) {
      return c.json({ error: 'Cannot remove team owner' }, 400)
    }

    await db.delete(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, memberUserId)))

    return c.json({ removed: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { teamRoutes }
