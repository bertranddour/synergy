import { Hono } from 'hono'
import type { Env } from '../env.js'

const userRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

userRoutes.get('/me', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.patch('/me', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.get('/me/frameworks', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.post('/me/frameworks', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.delete('/me/frameworks/:slug', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.get('/me/export', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

userRoutes.delete('/me', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { userRoutes }
