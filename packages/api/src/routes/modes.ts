import { Hono } from 'hono'
import type { Env } from '../env.js'

const modeRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

modeRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

modeRoutes.get('/:slug', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { modeRoutes }
