import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env.js'
import { auth } from './middleware/auth.js'
import { coachRateLimit, rateLimit } from './middleware/rate-limit.js'
import { assessmentRoutes } from './routes/assessments.js'
import { authRoutes } from './routes/auth.js'
import { coachRoutes } from './routes/coach.js'
import { healthRoutes } from './routes/health.js'
import { modeRoutes } from './routes/modes.js'
import { programRoutes } from './routes/programs.js'
import { progressRoutes } from './routes/progress.js'
import { sessionRoutes } from './routes/sessions.js'
import { teamRoutes } from './routes/teams.js'
import { userRoutes } from './routes/users.js'

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      // Allow localhost in dev, restrict in production
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
      if (origin === 'https://synergy.7flows.com') return origin
      return ''
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
)

// Rate limiting
app.use('/api/*', rateLimit())
app.use('/api/coach/*', coachRateLimit())

// Health check (no auth)
app.get('/api/health-check', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auth routes (no auth middleware)
app.route('/api/auth', authRoutes)

// Protected routes
app.use('/api/users/*', auth())
app.use('/api/modes/*', auth())
app.use('/api/sessions/*', auth())
app.use('/api/health/*', auth())
app.use('/api/coach/*', auth())
app.use('/api/assessments/*', auth())
app.use('/api/progress/*', auth())
app.use('/api/programs/*', auth())
app.use('/api/teams/*', auth())

app.route('/api/users', userRoutes)
app.route('/api/modes', modeRoutes)
app.route('/api/sessions', sessionRoutes)
app.route('/api/health', healthRoutes)
app.route('/api/coach', coachRoutes)
app.route('/api/assessments', assessmentRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/programs', programRoutes)
app.route('/api/teams', teamRoutes)

// 404 for unmatched API routes
app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

// Worker export with fetch, scheduled, and queue handlers
export default {
  fetch: app.fetch,

  // Cron trigger: generate proactive observations hourly
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    const { createDb } = await import('./lib/db.js')
    const { users } = await import('./db/schema.js')
    const { generateProactiveObservations } = await import('./services/proactive.js')
    const Anthropic = (await import('@anthropic-ai/sdk')).default

    const db = createDb(env.DB)
    const anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
      baseURL: env.AI_GATEWAY_ID
        ? `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic`
        : undefined,
    })

    // Process active users (limit to 50 per cron run)
    const activeUsers = await db.select({ id: users.id }).from(users).limit(50)

    for (const user of activeUsers) {
      await generateProactiveObservations(db, anthropic, user.id)
    }
  },

  // Queue consumer: async background processing
  async queue(batch: MessageBatch, _env: Env, _ctx: ExecutionContext) {
    for (const message of batch.messages) {
      try {
        const data = message.body as Record<string, unknown>
        console.log('Queue message:', data)
        message.ack()
      } catch {
        message.retry()
      }
    }
  },
}

export type AppType = typeof app

// Durable Object exports (required by Cloudflare)
export { AliciaAgent } from './agents/alicia/agent.js'
