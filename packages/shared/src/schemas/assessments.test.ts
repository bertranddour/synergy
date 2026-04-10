import { describe, expect, it } from 'vitest'
import { assessmentListQuerySchema, startAssessmentSchema, submitAnswerSchema } from './assessments'

describe('assessment schemas', () => {
  describe('startAssessmentSchema', () => {
    it('accepts all framework slugs', () => {
      for (const slug of ['core', 'air', 'max', 'synergy']) {
        expect(startAssessmentSchema.safeParse({ frameworkSlug: slug }).success).toBe(true)
      }
    })

    it('rejects invalid framework', () => {
      expect(startAssessmentSchema.safeParse({ frameworkSlug: 'invalid' }).success).toBe(false)
    })
  })

  describe('submitAnswerSchema', () => {
    it('accepts all valid answers', () => {
      for (const answer of ['a', 'b', 'c', 'd']) {
        expect(submitAnswerSchema.safeParse({ scenarioId: 'core-1', answer }).success).toBe(true)
      }
    })

    it('rejects invalid answer', () => {
      expect(submitAnswerSchema.safeParse({ scenarioId: 'core-1', answer: 'e' }).success).toBe(false)
    })

    it('rejects empty scenarioId', () => {
      expect(submitAnswerSchema.safeParse({ scenarioId: '', answer: 'a' }).success).toBe(false)
    })
  })

  describe('assessmentListQuerySchema', () => {
    it('defaults limit to 10', () => {
      const result = assessmentListQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.limit).toBe(10)
    })

    it('accepts framework filter', () => {
      expect(assessmentListQuerySchema.safeParse({ frameworkSlug: 'core' }).success).toBe(true)
    })

    it('coerces limit string to number', () => {
      const result = assessmentListQuerySchema.safeParse({ limit: '5' })
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.limit).toBe(5)
    })
  })
})
