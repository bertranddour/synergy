import { Hono } from 'hono'
import type { Env } from '../env.js'

const healthRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

healthRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

healthRoutes.get('/:category', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { healthRoutes }
