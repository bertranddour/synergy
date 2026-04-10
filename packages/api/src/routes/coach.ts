import { Hono } from 'hono'
import type { Env } from '../env.js'

const coachRoutes = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

coachRoutes.post('/stream', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

coachRoutes.post('/message', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

coachRoutes.get('/proactive', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

coachRoutes.post('/proactive/:id/dismiss', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

coachRoutes.post('/proactive/:id/act', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})

export { coachRoutes }
