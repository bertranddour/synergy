import { describe, expect, it } from 'vitest'
import { enrollProgramSchema, programListQuerySchema, trainingProgramSchema } from './programs'

describe('program schemas', () => {
  describe('trainingProgramSchema', () => {
    it('accepts valid program', () => {
      expect(
        trainingProgramSchema.safeParse({
          id: 'prog-1',
          slug: 'test-program',
          name: 'Test Program',
          description: 'A test',
          durationDays: 5,
          frameworksRequired: ['core'],
          modeSequence: [{ day: 1, modeSlug: 'validation', description: 'Test' }],
          targetStage: 'solo',
        }).success,
      ).toBe(true)
    })

    it('accepts null targetStage', () => {
      expect(
        trainingProgramSchema.safeParse({
          id: 'prog-1',
          slug: 'test',
          name: 'Test',
          description: 'Test',
          durationDays: 5,
          frameworksRequired: ['core'],
          modeSequence: [],
          targetStage: null,
        }).success,
      ).toBe(true)
    })
  })

  describe('enrollProgramSchema', () => {
    it('accepts valid slug', () => {
      expect(enrollProgramSchema.safeParse({ programSlug: 'my-program' }).success).toBe(true)
    })

    it('rejects empty slug', () => {
      expect(enrollProgramSchema.safeParse({ programSlug: '' }).success).toBe(false)
    })
  })

  describe('programListQuerySchema', () => {
    it('accepts empty query', () => {
      expect(programListQuerySchema.safeParse({}).success).toBe(true)
    })

    it('accepts stage filter', () => {
      expect(programListQuerySchema.safeParse({ stage: 'solo' }).success).toBe(true)
    })

    it('rejects invalid stage', () => {
      expect(programListQuerySchema.safeParse({ stage: 'invalid' }).success).toBe(false)
    })
  })
})
