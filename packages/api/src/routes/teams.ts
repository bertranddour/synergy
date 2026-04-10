import { Hono } from 'hono'
import type { Env } from '../env.js'

const teamRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

teamRoutes.post('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

teamRoutes.get('/:id', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

teamRoutes.get('/:id/health', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

teamRoutes.post('/:id/members', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

teamRoutes.delete('/:id/members/:userId', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { teamRoutes }
