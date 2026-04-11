import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { teamInvitations, teamMembers, teams, users } from '../db/schema.js'
import type { Env } from '../env.js'
import { createDb } from '../lib/db.js'

const invitationRoutes = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

// ─── Get Invitation Info (public, no auth) ──────────────────────────────────

invitationRoutes.get('/info', async (c) => {
  try {
    const token = c.req.query('token')
    if (!token) {
      return c.json({ error: 'Missing token' }, 400)
    }

    const db = createDb(c.env.DB)

    const results = await db
      .select({
        email: teamInvitations.email,
        status: teamInvitations.status,
        expiresAt: teamInvitations.expiresAt,
        teamName: teams.name,
        teamType: teams.type,
        inviterName: users.name,
      })
      .from(teamInvitations)
      .innerJoin(teams, eq(teamInvitations.teamId, teams.id))
      .innerJoin(users, eq(teamInvitations.invitedBy, users.id))
      .where(eq(teamInvitations.token, token))

    const invitation = results[0]
    if (!invitation) {
      return c.json({ error: 'Invitation not found' }, 404)
    }

    const now = new Date()
    const expired = invitation.status !== 'pending' || invitation.expiresAt < now

    return c.json({
      teamName: invitation.teamName,
      teamType: invitation.teamType,
      inviterName: invitation.inviterName,
      email: invitation.email,
      expiresAt: invitation.expiresAt.toISOString(),
      expired,
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Accept Invitation (auth required — middleware applied in index.ts) ─────

invitationRoutes.post('/accept', async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const { token } = body as { token?: string }

    if (!token) {
      return c.json({ error: 'Missing token' }, 400)
    }

    const db = createDb(c.env.DB)

    // Find pending invitation by token
    const invitation = await db.query.teamInvitations.findFirst({
      where: and(eq(teamInvitations.token, token), eq(teamInvitations.status, 'pending')),
    })
    if (!invitation) {
      return c.json({ error: 'Invalid or expired invitation' }, 400)
    }

    // Check expiry
    const now = new Date()
    if (invitation.expiresAt < now) {
      return c.json({ error: 'Invitation has expired' }, 400)
    }

    // Verify email matches
    const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) })
    if (!currentUser) {
      return c.json({ error: 'User not found' }, 404)
    }
    if (currentUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return c.json({ error: 'This invitation was sent to a different email address' }, 403)
    }

    // Check not already a member — skip insert if so
    const alreadyMember = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, invitation.teamId), eq(teamMembers.userId, userId)),
    })
    if (!alreadyMember) {
      await db.insert(teamMembers).values({
        teamId: invitation.teamId,
        userId,
        role: invitation.role,
        joinedAt: now,
      })
    }

    // Mark invitation as accepted
    await db
      .update(teamInvitations)
      .set({ status: 'accepted', acceptedAt: now })
      .where(eq(teamInvitations.id, invitation.id))

    // Clean up KV
    await c.env.KV.delete(`invite:${token}`)

    return c.json({ accepted: true, teamId: invitation.teamId })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { invitationRoutes }
