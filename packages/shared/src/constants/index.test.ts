import { describe, expect, it } from 'vitest'
import {
  COACH_SURFACES,
  FRAMEWORK_COLORS,
  FRAMEWORK_NAMES,
  FRAMEWORK_SLUGS,
  getHealthColor,
  HEALTH_CATEGORIES,
  HEALTH_COLORS,
  MATURITY_LEVELS,
  PROACTIVE_TRIGGERS,
  SESSION_DECISIONS,
  SESSION_STATUSES,
  TEAM_TYPES,
  USER_STAGES,
} from './index'

describe('constants', () => {
  it('has 4 framework colors', () => {
    expect(Object.keys(FRAMEWORK_COLORS)).toHaveLength(4)
    expect(FRAMEWORK_COLORS.core).toBe('#3B82F6')
    expect(FRAMEWORK_COLORS.air).toBe('#14B8A6')
    expect(FRAMEWORK_COLORS.max).toBe('#8B5CF6')
    expect(FRAMEWORK_COLORS.synergy).toBe('#F59E0B')
  })

  it('has 4 framework names', () => {
    expect(Object.keys(FRAMEWORK_NAMES)).toHaveLength(4)
  })

  it('has 5 health categories', () => {
    expect(HEALTH_CATEGORIES).toHaveLength(5)
  })

  it('has 4 framework slugs', () => {
    expect(FRAMEWORK_SLUGS).toHaveLength(4)
  })

  it('has correct user stages', () => {
    expect(USER_STAGES).toEqual(['solo', 'small-team', 'growing', 'scaling'])
  })

  it('has correct session statuses', () => {
    expect(SESSION_STATUSES).toEqual(['in_progress', 'completed', 'abandoned'])
  })

  it('has correct session decisions', () => {
    expect(SESSION_DECISIONS).toEqual(['persevere', 'pivot', 'experiment-again'])
  })

  it('has correct maturity levels', () => {
    expect(MATURITY_LEVELS).toEqual(['standing-still', 'crawling', 'walking', 'running', 'flying'])
  })

  it('has correct team types', () => {
    expect(TEAM_TYPES).toEqual(['mission', 'platform', 'leadership-circle'])
  })

  it('has 5 proactive triggers', () => {
    expect(PROACTIVE_TRIGGERS).toHaveLength(5)
  })

  it('has 5 coach surfaces', () => {
    expect(COACH_SURFACES).toHaveLength(5)
  })

  describe('getHealthColor', () => {
    it('returns green for scores >= 70', () => {
      expect(getHealthColor(70)).toBe(HEALTH_COLORS.green.color)
      expect(getHealthColor(100)).toBe(HEALTH_COLORS.green.color)
      expect(getHealthColor(85)).toBe(HEALTH_COLORS.green.color)
    })

    it('returns yellow for scores 40-69', () => {
      expect(getHealthColor(40)).toBe(HEALTH_COLORS.yellow.color)
      expect(getHealthColor(69)).toBe(HEALTH_COLORS.yellow.color)
      expect(getHealthColor(55)).toBe(HEALTH_COLORS.yellow.color)
    })

    it('returns orange for scores 20-39', () => {
      expect(getHealthColor(20)).toBe(HEALTH_COLORS.orange.color)
      expect(getHealthColor(39)).toBe(HEALTH_COLORS.orange.color)
    })

    it('returns red for scores < 20', () => {
      expect(getHealthColor(0)).toBe(HEALTH_COLORS.red.color)
      expect(getHealthColor(19)).toBe(HEALTH_COLORS.red.color)
    })
  })
})
