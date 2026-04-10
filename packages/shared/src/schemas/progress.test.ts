import { describe, expect, it } from 'vitest'
import { progressHistoryQuerySchema, progressRingsSchema } from './progress'

describe('progress schemas', () => {
  describe('progressRingsSchema', () => {
    it('accepts valid progress', () => {
      expect(
        progressRingsSchema.safeParse({
          completion: { value: 3, target: 5, percentage: 60 },
          consistency: { streakWeeks: 4, lastActiveWeek: '2026-04-07' },
          growth: { score: 72, trend: 'improving', improvingMetrics: ['assumptions_tested'] },
          period: { start: '2026-04-07T00:00:00.000Z', end: '2026-04-13T23:59:59.999Z', type: 'weekly' },
        }).success,
      ).toBe(true)
    })

    it('rejects score above 100', () => {
      expect(
        progressRingsSchema.safeParse({
          completion: { value: 3, target: 5, percentage: 150 },
          consistency: { streakWeeks: 0, lastActiveWeek: '' },
          growth: { score: 0, trend: 'stable', improvingMetrics: [] },
          period: { start: '2026-04-07T00:00:00.000Z', end: '2026-04-13T23:59:59.999Z', type: 'weekly' },
        }).success,
      ).toBe(false)
    })
  })

  describe('progressHistoryQuerySchema', () => {
    it('defaults to weekly with limit 12', () => {
      const result = progressHistoryQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.period).toBe('weekly')
        expect(result.data.limit).toBe(12)
      }
    })

    it('accepts monthly period', () => {
      expect(progressHistoryQuerySchema.safeParse({ period: 'monthly' }).success).toBe(true)
    })
  })
})
