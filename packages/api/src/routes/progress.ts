import { Hono } from 'hono'
import type { Env } from '../env.js'

const progressRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

progressRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

progressRoutes.get('/history', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { progressRoutes }
