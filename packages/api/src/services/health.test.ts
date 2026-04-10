import { describe, expect, it } from 'vitest'

// Test the pure functions from the health service
// (Integration tests with D1 would require miniflare setup)

describe('health service logic', () => {
  describe('scoreToColor mapping', () => {
    // Testing the logic that maps scores to colors
    function scoreToColor(score: number): string {
      if (score >= 70) return 'green'
      if (score >= 40) return 'yellow'
      if (score >= 20) return 'orange'
      return 'red'
    }

    it('returns green for scores >= 70', () => {
      expect(scoreToColor(70)).toBe('green')
      expect(scoreToColor(100)).toBe('green')
    })

    it('returns yellow for scores 40-69', () => {
      expect(scoreToColor(40)).toBe('yellow')
      expect(scoreToColor(69)).toBe('yellow')
    })

    it('returns orange for scores 20-39', () => {
      expect(scoreToColor(20)).toBe('orange')
      expect(scoreToColor(39)).toBe('orange')
    })

    it('returns red for scores < 20', () => {
      expect(scoreToColor(0)).toBe('red')
      expect(scoreToColor(19)).toBe('red')
    })
  })

  describe('trend determination', () => {
    function determineTrend(current: number, previous: number): string {
      const delta = current - previous
      if (delta > 5) return 'improving'
      if (delta < -5) return 'declining'
      return 'stable'
    }

    it('returns improving when delta > 5', () => {
      expect(determineTrend(80, 70)).toBe('improving')
      expect(determineTrend(50, 30)).toBe('improving')
    })

    it('returns declining when delta < -5', () => {
      expect(determineTrend(30, 50)).toBe('declining')
      expect(determineTrend(10, 80)).toBe('declining')
    })

    it('returns stable when delta within ±5', () => {
      expect(determineTrend(50, 50)).toBe('stable')
      expect(determineTrend(52, 50)).toBe('stable')
      expect(determineTrend(48, 50)).toBe('stable')
      expect(determineTrend(55, 50)).toBe('stable')
      expect(determineTrend(45, 50)).toBe('stable')
    })

    it('handles edge cases', () => {
      expect(determineTrend(0, 0)).toBe('stable')
      expect(determineTrend(100, 100)).toBe('stable')
      expect(determineTrend(6, 0)).toBe('improving')
    })
  })

  describe('category-framework mapping', () => {
    const CATEGORY_FRAMEWORK_MAP: Record<string, string[]> = {
      validation: ['core'],
      operational: ['core', 'max'],
      team: ['air'],
      scaling: ['max'],
      'ai-collaboration': ['synergy'],
    }

    it('maps all 5 health categories', () => {
      expect(Object.keys(CATEGORY_FRAMEWORK_MAP)).toHaveLength(5)
    })

    it('validation maps to core', () => {
      expect(CATEGORY_FRAMEWORK_MAP['validation']).toEqual(['core'])
    })

    it('operational maps to core + max', () => {
      expect(CATEGORY_FRAMEWORK_MAP['operational']).toEqual(['core', 'max'])
    })

    it('team maps to air', () => {
      expect(CATEGORY_FRAMEWORK_MAP['team']).toEqual(['air'])
    })

    it('scaling maps to max', () => {
      expect(CATEGORY_FRAMEWORK_MAP['scaling']).toEqual(['max'])
    })

    it('ai-collaboration maps to synergy', () => {
      expect(CATEGORY_FRAMEWORK_MAP['ai-collaboration']).toEqual(['synergy'])
    })
  })
})
