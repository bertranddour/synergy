import { Hono } from 'hono'
import type { Env } from '../env.js'

const sessionRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

sessionRoutes.post('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

sessionRoutes.patch('/:id', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

sessionRoutes.post('/:id/complete', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

sessionRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

sessionRoutes.get('/:id', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { sessionRoutes }
