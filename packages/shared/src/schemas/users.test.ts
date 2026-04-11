import { describe, expect, it } from 'vitest'
import { activateFrameworkSchema, updateUserSchema, userSchema } from './users'

describe('user schemas', () => {
  describe('userSchema', () => {
    it('accepts valid user', () => {
      expect(
        userSchema.safeParse({
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test',
          avatarUrl: null,
          stage: 'solo',
          teamSize: 1,
          onboardingCompleted: false,
          locale: 'en',
          createdAt: '2026-04-10T00:00:00.000Z',
          updatedAt: '2026-04-10T00:00:00.000Z',
        }).success,
      ).toBe(true)
    })

    it('rejects invalid stage', () => {
      expect(
        userSchema.safeParse({
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test',
          avatarUrl: null,
          stage: 'invalid',
          teamSize: 1,
          onboardingCompleted: false,
          locale: 'en',
          createdAt: '2026-04-10T00:00:00.000Z',
          updatedAt: '2026-04-10T00:00:00.000Z',
        }).success,
      ).toBe(false)
    })
  })

  describe('updateUserSchema', () => {
    it('accepts partial updates', () => {
      expect(updateUserSchema.safeParse({ name: 'New Name' }).success).toBe(true)
      expect(updateUserSchema.safeParse({ stage: 'growing' }).success).toBe(true)
      expect(updateUserSchema.safeParse({ teamSize: 10 }).success).toBe(true)
    })

    it('accepts empty update', () => {
      expect(updateUserSchema.safeParse({}).success).toBe(true)
    })

    it('rejects invalid stage', () => {
      expect(updateUserSchema.safeParse({ stage: 'invalid' }).success).toBe(false)
    })

    it('rejects zero team size', () => {
      expect(updateUserSchema.safeParse({ teamSize: 0 }).success).toBe(false)
    })
  })

  describe('activateFrameworkSchema', () => {
    it('accepts all valid framework slugs', () => {
      for (const slug of ['core', 'air', 'max', 'synergy']) {
        expect(activateFrameworkSchema.safeParse({ frameworkSlug: slug }).success).toBe(true)
      }
    })

    it('rejects invalid framework', () => {
      expect(activateFrameworkSchema.safeParse({ frameworkSlug: 'invalid' }).success).toBe(false)
    })
  })
})
