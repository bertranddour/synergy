import { describe, it, expect } from 'vitest'
import { createSessionSchema, updateSessionFieldSchema, completeSessionSchema, sessionListQuerySchema } from './sessions'

describe('session schemas', () => {
  describe('createSessionSchema', () => {
    it('accepts valid session creation', () => {
      const result = createSessionSchema.safeParse({ modeSlug: 'validation' })
      expect(result.success).toBe(true)
    })

    it('accepts with optional teamId', () => {
      const result = createSessionSchema.safeParse({ modeSlug: 'validation', teamId: 'team-1' })
      expect(result.success).toBe(true)
    })

    it('rejects empty modeSlug', () => {
      const result = createSessionSchema.safeParse({ modeSlug: '' })
      expect(result.success).toBe(false)
    })

    it('rejects missing modeSlug', () => {
      const result = createSessionSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('updateSessionFieldSchema', () => {
    it('accepts valid field update', () => {
      const result = updateSessionFieldSchema.safeParse({
        fieldIndex: 0,
        fieldData: 'My assumption is that users will pay $49/month.',
      })
      expect(result.success).toBe(true)
    })

    it('accepts any fieldData type', () => {
      expect(updateSessionFieldSchema.safeParse({ fieldIndex: 0, fieldData: 42 }).success).toBe(true)
      expect(updateSessionFieldSchema.safeParse({ fieldIndex: 0, fieldData: { nested: true } }).success).toBe(true)
      expect(updateSessionFieldSchema.safeParse({ fieldIndex: 0, fieldData: null }).success).toBe(true)
    })

    it('rejects negative fieldIndex', () => {
      const result = updateSessionFieldSchema.safeParse({ fieldIndex: -1, fieldData: 'test' })
      expect(result.success).toBe(false)
    })
  })

  describe('completeSessionSchema', () => {
    it('accepts valid decision', () => {
      const result = completeSessionSchema.safeParse({ decision: 'persevere' })
      expect(result.success).toBe(true)
    })

    it('accepts empty body (no decision)', () => {
      const result = completeSessionSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('rejects invalid decision', () => {
      const result = completeSessionSchema.safeParse({ decision: 'invalid' })
      expect(result.success).toBe(false)
    })

    it('accepts all valid decisions', () => {
      expect(completeSessionSchema.safeParse({ decision: 'persevere' }).success).toBe(true)
      expect(completeSessionSchema.safeParse({ decision: 'pivot' }).success).toBe(true)
      expect(completeSessionSchema.safeParse({ decision: 'experiment-again' }).success).toBe(true)
    })
  })

  describe('sessionListQuerySchema', () => {
    it('provides defaults', () => {
      const result = sessionListQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(20)
        expect(result.data.offset).toBe(0)
      }
    })

    it('coerces string numbers', () => {
      const result = sessionListQuerySchema.safeParse({ limit: '10', offset: '5' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(10)
        expect(result.data.offset).toBe(5)
      }
    })
  })
})
