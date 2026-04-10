import { describe, expect, it } from 'vitest'
import { addMemberSchema, createTeamSchema } from './teams'

describe('team schemas', () => {
  describe('createTeamSchema', () => {
    it('accepts valid team', () => {
      expect(createTeamSchema.safeParse({ name: 'Alpha', type: 'mission' }).success).toBe(true)
    })

    it('rejects empty name', () => {
      expect(createTeamSchema.safeParse({ name: '', type: 'mission' }).success).toBe(false)
    })

    it('accepts all team types', () => {
      for (const type of ['mission', 'platform', 'leadership-circle']) {
        expect(createTeamSchema.safeParse({ name: 'Test', type }).success).toBe(true)
      }
    })

    it('rejects invalid team type', () => {
      expect(createTeamSchema.safeParse({ name: 'Test', type: 'invalid' }).success).toBe(false)
    })
  })

  describe('addMemberSchema', () => {
    it('accepts valid member', () => {
      expect(addMemberSchema.safeParse({ email: 'user@test.com' }).success).toBe(true)
    })

    it('defaults role to member', () => {
      const result = addMemberSchema.safeParse({ email: 'user@test.com' })
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.role).toBe('member')
    })

    it('accepts lead role', () => {
      expect(addMemberSchema.safeParse({ email: 'user@test.com', role: 'lead' }).success).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(addMemberSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
    })
  })
})
