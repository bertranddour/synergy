import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env.js'
import { auth } from './middleware/auth.js'
import { coachRateLimit, magicLinkRateLimit, rateLimit } from './middleware/rate-limit.js'
import { activityRoutes } from './routes/activity.js'
import { assessmentRoutes } from './routes/assessments.js'
import { authRoutes } from './routes/auth.js'
import { coachRoutes } from './routes/coach.js'
import { healthRoutes } from './routes/health.js'
import { invitationRoutes } from './routes/invitations.js'
import { modeRoutes } from './routes/modes.js'
import { programRoutes } from './routes/programs.js'
import { progressRoutes } from './routes/progress.js'
import { sessionRoutes } from './routes/sessions.js'
import { teamRoutes } from './routes/teams.js'
import { userRoutes } from './routes/users.js'

const app = new Hono<{ Bindings: Env; Variables: { userId: string; locale: string } }>()

// Global middleware
app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      // Production origin
      if (origin === 'https://synergy.7flows.com') return origin
      // Development origins (exact match only — no substring matching)
      if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') return origin
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
app.use('/api/auth/magic-link', magicLinkRateLimit())

// Health check (no auth)
app.get('/api/health-check', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auth routes (no auth middleware)
app.route('/api/auth', authRoutes)

// Invitation accept requires auth, but info is public
app.use('/api/invitations/accept', auth())
app.route('/api/invitations', invitationRoutes)

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
app.use('/api/activity/*', auth())

app.route('/api/users', userRoutes)
app.route('/api/modes', modeRoutes)
app.route('/api/sessions', sessionRoutes)
app.route('/api/health', healthRoutes)
app.route('/api/coach', coachRoutes)
app.route('/api/assessments', assessmentRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/programs', programRoutes)
app.route('/api/teams', teamRoutes)
app.route('/api/activity', activityRoutes)

// 404 for unmatched API routes
app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

// Worker export with fetch, scheduled, and queue handlers
export default {
  fetch: app.fetch,

  // Cron trigger: generate proactive observations hourly
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    const { createDb } = await import('./lib/db.js')
    const { generateProactiveObservations } = await import('./services/proactive.js')
    const { createAnthropicClient } = await import('./lib/anthropic.js')

    const db = createDb(env.DB)
    const anthropic = createAnthropicClient(env)

    // Process only recently active users (sessions in last 30 days)
    const { sessions } = await import('./db/schema.js')
    const { gte } = await import('drizzle-orm')
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const activeUserIds = await db
      .selectDistinct({ userId: sessions.userId })
      .from(sessions)
      .where(gte(sessions.startedAt, thirtyDaysAgo))
      .limit(50)

    // Use Promise.allSettled for concurrent processing with resilience
    await Promise.allSettled(activeUserIds.map((u) => generateProactiveObservations(db, anthropic, u.userId)))
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
