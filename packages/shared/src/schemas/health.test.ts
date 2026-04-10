import { describe, expect, it } from 'vitest'
import { healthCategorySchema, healthDashboardSchema } from './health'

describe('health schemas', () => {
  describe('healthCategorySchema', () => {
    it('accepts valid category', () => {
      const result = healthCategorySchema.safeParse({
        name: 'validation',
        score: 78,
        trend: 'improving',
        trendPeriods: 2,
        color: 'green',
        topMetrics: [{ name: 'assumptions_tested', value: 5, unit: 'count' }],
        recommendedModes: ['validation', 'insight-capture'],
      })
      expect(result.success).toBe(true)
    })

    it('rejects score > 100', () => {
      const result = healthCategorySchema.safeParse({
        name: 'validation',
        score: 150,
        trend: 'stable',
        trendPeriods: 0,
        color: 'green',
        topMetrics: [],
        recommendedModes: [],
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid trend', () => {
      const result = healthCategorySchema.safeParse({
        name: 'validation',
        score: 50,
        trend: 'unknown',
        trendPeriods: 0,
        color: 'yellow',
        topMetrics: [],
        recommendedModes: [],
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid color', () => {
      const result = healthCategorySchema.safeParse({
        name: 'validation',
        score: 50,
        trend: 'stable',
        trendPeriods: 0,
        color: 'purple',
        topMetrics: [],
        recommendedModes: [],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('healthDashboardSchema', () => {
    it('accepts valid dashboard', () => {
      const result = healthDashboardSchema.safeParse({
        categories: [],
        overallScore: 0,
        biggestRisk: 'No data yet',
        lastUpdated: '2026-04-10T00:00:00.000Z',
      })
      expect(result.success).toBe(true)
    })
  })
})
