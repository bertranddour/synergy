import { magicLinkRequestSchema } from '@synergy/shared'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { users } from '../db/schema.js'
import type { Env } from '../env.js'
import { signToken, verifyToken } from '../lib/crypto.js'
import { createDb } from '../lib/db.js'
import { sendMagicLinkEmail } from '../lib/email.js'
import { newId } from '../lib/id.js'
import { signJWT, verifyJWT } from '../middleware/auth.js'

const authRoutes = new Hono<{ Bindings: Env }>()

// ─── Magic Link ──────────────────────────────────────────────────────────────

authRoutes.post('/magic-link', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = magicLinkRequestSchema.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'Invalid email', details: parsed.error.flatten() }, 400)
    }

    const { email } = parsed.data
    const payload = JSON.stringify({ email, ts: Date.now() })
    const token = await signToken(payload, c.env.MAGIC_LINK_SECRET)

    await c.env.KV.put(`magic:${token}`, email, { expirationTtl: 900 })

    // Build the verification URL — points to the frontend /verify page
    // The frontend page calls GET /api/auth/verify and handles the JWT
    const baseUrl =
      c.env.ENVIRONMENT === 'development' ? 'http://localhost:5173/verify' : 'https://synergy.7flows.com/verify'
    const verifyUrl = `${baseUrl}?token=${encodeURIComponent(token)}`

    // Send magic link email via Resend
    await sendMagicLinkEmail(c.env, email, verifyUrl)

    // Also log in development for debugging
    if (c.env.ENVIRONMENT === 'development') {
      console.log(`[Magic Link] ${email}: ${verifyUrl}`)
    }

    return c.json({ sent: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Verify Magic Link ───────────────────────────────────────────────────────

authRoutes.get('/verify', async (c) => {
  try {
    const token = c.req.query('token')
    if (!token) {
      return c.json({ error: 'Missing token' }, 400)
    }

    // Verify token signature
    const payload = await verifyToken(token, c.env.MAGIC_LINK_SECRET)
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Check token exists in KV (prevents replay)
    const storedEmail = await c.env.KV.get(`magic:${token}`)
    if (!storedEmail) {
      return c.json({ error: 'Token expired or already used' }, 401)
    }

    // Delete token to prevent reuse
    await c.env.KV.delete(`magic:${token}`)

    // Parse payload and validate cryptographic TTL (defense in depth beyond KV TTL)
    let email: string
    try {
      const data = JSON.parse(payload) as { email: string; ts: number }
      email = data.email

      // Reject tokens older than 15 minutes regardless of KV state
      if (Date.now() - data.ts > 15 * 60 * 1000) {
        return c.json({ error: 'Token expired' }, 401)
      }
    } catch {
      return c.json({ error: 'Malformed token payload' }, 400)
    }

    // Create or retrieve user
    const db = createDb(c.env.DB)
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      const now = new Date()
      const id = newId()
      await db.insert(users).values({
        id,
        email,
        name: email.split('@')[0] ?? 'User',
        stage: 'solo',
        teamSize: 1,
        onboardingCompleted: false,
        createdAt: now,
        updatedAt: now,
      })
      user = await db.query.users.findFirst({ where: eq(users.id, id) })
      if (!user) {
        return c.json({ error: 'Failed to create user' }, 500)
      }
    }

    // Generate JWT
    const jwt = await signJWT({ sub: user.id, email: user.email }, c.env.JWT_SECRET)

    // Store session in KV (7-day TTL)
    await c.env.KV.put(
      `session:${user.id}`,
      JSON.stringify({
        userId: user.id,
        email: user.email,
        createdAt: Date.now(),
      }),
      { expirationTtl: 7 * 24 * 60 * 60 },
    )

    return c.json({
      token: jwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        stage: user.stage,
        teamSize: user.teamSize,
        onboardingCompleted: user.onboardingCompleted,
      },
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Get Current User ────────────────────────────────────────────────────────

authRoutes.get('/me', async (c) => {
  try {
    const authorization = c.req.header('Authorization')
    if (!authorization) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authorization.replace('Bearer ', '')

    // Reuse exported verifyJWT — no duplicated crypto logic
    const jwtPayload = await verifyJWT(token, c.env.JWT_SECRET)
    if (!jwtPayload) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Check session
    const session = await c.env.KV.get(`session:${jwtPayload.sub}`)
    if (!session) {
      return c.json({ error: 'Session expired' }, 401)
    }

    // Get user
    const db = createDb(c.env.DB)
    const user = await db.query.users.findFirst({
      where: eq(users.id, jwtPayload.sub),
    })

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Rotate token if within 24h of expiry
    let newToken: string | undefined
    const hoursUntilExpiry = (jwtPayload.exp - Date.now() / 1000) / 3600
    if (hoursUntilExpiry < 24) {
      newToken = await signJWT({ sub: user.id, email: user.email }, c.env.JWT_SECRET)
      // Refresh session TTL
      await c.env.KV.put(
        `session:${user.id}`,
        JSON.stringify({
          userId: user.id,
          email: user.email,
          createdAt: Date.now(),
        }),
        { expirationTtl: 7 * 24 * 60 * 60 },
      )
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        stage: user.stage,
        teamSize: user.teamSize,
        onboardingCompleted: user.onboardingCompleted,
      },
      ...(newToken ? { token: newToken } : {}),
    })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ─── Logout ──────────────────────────────────────────────────────────────────

authRoutes.post('/logout', async (c) => {
  try {
    const authorization = c.req.header('Authorization')
    if (!authorization) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authorization.replace('Bearer ', '')

    // Verify JWT signature before extracting claims (prevents arbitrary session deletion)
    const jwtPayload = await verifyJWT(token, c.env.JWT_SECRET)
    if (jwtPayload) {
      await c.env.KV.delete(`session:${jwtPayload.sub}`)
    }

    return c.json({ logged_out: true })
  } catch (err) {
    console.error('Route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { authRoutes }
