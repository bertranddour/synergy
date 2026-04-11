import { createMiddleware } from 'hono/factory'
import type { Env } from '../env.js'

/** JWT payload structure */
interface JWTPayload {
  sub: string
  email: string
  iat: number
  exp: number
}

/** Decode and verify a JWT token using Web Crypto API */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !signatureB64) return null

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
      'verify',
    ])

    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return null

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload

    if (payload.exp < Date.now() / 1000) return null

    return payload
  } catch {
    return null
  }
}

/** Generate a JWT token */
export async function signJWT(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInDays = 7,
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])

  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInDays * 24 * 60 * 60,
  }

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const body = btoa(JSON.stringify(fullPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const data = encoder.encode(`${header}.${body}`)
  const signature = await crypto.subtle.sign('HMAC', key, data)
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return `${header}.${body}.${sig}`
}

/** Auth middleware — validates JWT and sets userId + locale in context */
export const auth = () =>
  createMiddleware<{ Bindings: Env; Variables: { userId: string; locale: string } }>(async (c, next) => {
    const authorization = c.req.header('Authorization')
    if (!authorization) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authorization.replace('Bearer ', '')
    const payload = await verifyJWT(token, c.env.JWT_SECRET)
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Verify session exists in KV
    const session = await c.env.KV.get(`session:${payload.sub}`)
    if (!session) {
      return c.json({ error: 'Session expired' }, 401)
    }

    // Extract locale from session data
    let locale = 'en'
    try {
      const sessionData = JSON.parse(session) as { locale?: string }
      if (sessionData.locale) locale = sessionData.locale
    } catch {
      // Legacy session format (plain string) — default to 'en'
    }

    c.set('userId', payload.sub)
    c.set('locale', locale)
    await next()
  })
