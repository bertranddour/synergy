import { Hono } from 'hono'
import type { Env } from '../env.js'

const authRoutes = new Hono<{ Bindings: Env }>()

authRoutes.post('/magic-link', async (c) => {
  // TODO: Phase 1.6 — magic link flow
  return c.json({ sent: true })
})

authRoutes.get('/verify', async (c) => {
  // TODO: Phase 1.6 — verify magic link token
  return c.json({ error: 'Not implemented' }, 501)
})

authRoutes.post('/oauth/google', async (c) => {
  // TODO: Phase 1.6 — Google OAuth callback
  return c.json({ error: 'Not implemented' }, 501)
})

authRoutes.post('/oauth/github', async (c) => {
  // TODO: Phase 1.6 — GitHub OAuth callback
  return c.json({ error: 'Not implemented' }, 501)
})

authRoutes.get('/me', async (c) => {
  // TODO: Phase 1.6 — get current user
  return c.json({ error: 'Not implemented' }, 501)
})

authRoutes.post('/logout', async (c) => {
  // TODO: Phase 1.6 — invalidate session
  return c.json({ error: 'Not implemented' }, 501)
})

export { authRoutes }
