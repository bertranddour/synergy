import { describe, expect, it } from 'vitest'
import { authResponseSchema, magicLinkRequestSchema } from './auth'

describe('auth schemas', () => {
  describe('magicLinkRequestSchema', () => {
    it('accepts a valid email', () => {
      const result = magicLinkRequestSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('rejects an invalid email', () => {
      const result = magicLinkRequestSchema.safeParse({ email: 'not-an-email' })
      expect(result.success).toBe(false)
    })

    it('rejects missing email', () => {
      const result = magicLinkRequestSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('rejects empty email', () => {
      const result = magicLinkRequestSchema.safeParse({ email: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('authResponseSchema', () => {
    it('accepts a valid auth response', () => {
      const result = authResponseSchema.safeParse({
        token: 'jwt-token',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: null,
          stage: 'solo',
          teamSize: 1,
          onboardingCompleted: false,
        },
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid stage', () => {
      const result = authResponseSchema.safeParse({
        token: 'jwt-token',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: null,
          stage: 'invalid-stage',
          teamSize: 1,
          onboardingCompleted: false,
        },
      })
      expect(result.success).toBe(false)
    })
  })
})
