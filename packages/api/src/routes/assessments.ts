import { Hono } from 'hono'
import type { Env } from '../env.js'

const assessmentRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

assessmentRoutes.post('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

assessmentRoutes.patch('/:id', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

assessmentRoutes.post('/:id/complete', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

assessmentRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

assessmentRoutes.get('/:id', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { assessmentRoutes }
