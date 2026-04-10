import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env.js'
import { auth } from './middleware/auth.js'
import { rateLimit, coachRateLimit } from './middleware/rate-limit.js'
import { authRoutes } from './routes/auth.js'
import { userRoutes } from './routes/users.js'
import { modeRoutes } from './routes/modes.js'
import { sessionRoutes } from './routes/sessions.js'
import { healthRoutes } from './routes/health.js'
import { coachRoutes } from './routes/coach.js'
import { assessmentRoutes } from './routes/assessments.js'
import { progressRoutes } from './routes/progress.js'
import { programRoutes } from './routes/programs.js'
import { teamRoutes } from './routes/teams.js'

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('/api/*', cors({
  origin: (origin) => {
    // Allow localhost in dev, restrict in production
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
    if (origin === 'https://synergy.7flows.com') return origin
    return ''
  },
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

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

export default app
export type AppType = typeof app
