import { magicLinkRequestSchema, oauthCallbackSchema } from '@synergy/shared'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { users } from '../db/schema.js'
import type { Env } from '../env.js'
import { signToken, verifyToken } from '../lib/crypto.js'
import { createDb } from '../lib/db.js'
import { newId } from '../lib/id.js'
import { signJWT } from '../middleware/auth.js'

const authRoutes = new Hono<{ Bindings: Env }>()

// ─── Magic Link ──────────────────────────────────────────────────────────────

authRoutes.post('/magic-link', async (c) => {
  const body = await c.req.json()
  const parsed = magicLinkRequestSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid email', details: parsed.error.flatten() }, 400)
  }

  const { email } = parsed.data
  const payload = JSON.stringify({ email, ts: Date.now() })
  const token = await signToken(payload, c.env.MAGIC_LINK_SECRET)

  // Store token in KV with 15-minute TTL
  await c.env.KV.put(`magic:${token}`, email, { expirationTtl: 900 })

  // In production, send email via Resend/SES/etc.
  // For now, log the verification URL
  const verifyUrl = `${c.req.url.replace('/magic-link', '/verify')}?token=${encodeURIComponent(token)}`
  console.log(`[Magic Link] ${email}: ${verifyUrl}`)

  return c.json({ sent: true })
})

// ─── Verify Magic Link ───────────────────────────────────────────────────────

authRoutes.get('/verify', async (c) => {
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

  // Parse payload
  let email: string
  try {
    const data = JSON.parse(payload) as { email: string; ts: number }
    email = data.email
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
})

// ─── OAuth: Google ───────────────────────────────────────────────────────────

authRoutes.post('/oauth/google', async (c) => {
  const body = await c.req.json()
  const parsed = oauthCallbackSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid callback data' }, 400)
  }

  // Exchange code for token with Google
  // This will be implemented when OAuth client IDs are configured
  return c.json({ error: 'Google OAuth not yet configured' }, 501)
})

// ─── OAuth: GitHub ───────────────────────────────────────────────────────────

authRoutes.post('/oauth/github', async (c) => {
  const body = await c.req.json()
  const parsed = oauthCallbackSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid callback data' }, 400)
  }

  // Exchange code for token with GitHub
  // This will be implemented when OAuth client IDs are configured
  return c.json({ error: 'GitHub OAuth not yet configured' }, 501)
})

// ─── Get Current User ────────────────────────────────────────────────────────

authRoutes.get('/me', async (c) => {
  const authorization = c.req.header('Authorization')
  if (!authorization) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authorization.replace('Bearer ', '')

  // Inline JWT verification (this route is outside the auth middleware)
  const [headerB64, payloadB64, signatureB64] = token.split('.')
  if (!headerB64 || !payloadB64 || !signatureB64) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(c.env.JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const data = encoder.encode(`${headerB64}.${payloadB64}`)
  const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
  const valid = await crypto.subtle.verify('HMAC', key, signature, data)
  if (!valid) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const jwtPayload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as {
    sub: string
    email: string
    iat: number
    exp: number
  }

  if (jwtPayload.exp < Date.now() / 1000) {
    return c.json({ error: 'Token expired' }, 401)
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
})

// ─── Logout ──────────────────────────────────────────────────────────────────

authRoutes.post('/logout', async (c) => {
  const authorization = c.req.header('Authorization')
  if (!authorization) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authorization.replace('Bearer ', '')

  // Quick decode to get user ID (no full verify needed — logout is idempotent)
  try {
    const payloadB64 = token.split('.')[1]
    if (!payloadB64) return c.json({ logged_out: true })
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as { sub: string }
    await c.env.KV.delete(`session:${payload.sub}`)
  } catch {
    // Ignore decode errors — logout is best-effort
  }

  return c.json({ logged_out: true })
})

export { authRoutes }
