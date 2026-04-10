import { Hono } from 'hono'
import type { Env } from '../env.js'

const programRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

programRoutes.get('/', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

programRoutes.post('/:slug/enroll', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

programRoutes.get('/active', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

programRoutes.post('/active/complete', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { programRoutes }
