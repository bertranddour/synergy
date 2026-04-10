import { createMiddleware } from 'hono/factory'
import type { Env } from '../env.js'

interface RateLimitOptions {
  /** Requests allowed per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

/**
 * Simple KV-based rate limiter.
 * Tracks request count per IP per window in KV.
 */
export const rateLimit = (options: RateLimitOptions = { limit: 100, windowSeconds: 60 }) =>
  createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'
    const window = Math.floor(Date.now() / 1000 / options.windowSeconds)
    const key = `rate:${ip}:${window}`

    const current = await c.env.KV.get(key)
    const count = current ? parseInt(current, 10) : 0

    if (count >= options.limit) {
      return c.json({ error: 'Rate limit exceeded' }, 429)
    }

    await c.env.KV.put(key, String(count + 1), {
      expirationTtl: options.windowSeconds,
    })

    c.header('X-RateLimit-Limit', String(options.limit))
    c.header('X-RateLimit-Remaining', String(options.limit - count - 1))

    await next()
  })

/** Stricter rate limit for AI coach endpoints */
export const coachRateLimit = () => rateLimit({ limit: 20, windowSeconds: 60 })
