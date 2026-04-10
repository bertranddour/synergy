import { describe, expect, it } from 'vitest'
import { determineTrend, scoreToColor } from './health'

describe('health service', () => {
  describe('scoreToColor (imported from real source)', () => {
    it('returns green for scores >= 70', () => {
      expect(scoreToColor(70)).toBe('green')
      expect(scoreToColor(100)).toBe('green')
      expect(scoreToColor(85)).toBe('green')
    })

    it('returns yellow for scores 40-69', () => {
      expect(scoreToColor(40)).toBe('yellow')
      expect(scoreToColor(69)).toBe('yellow')
      expect(scoreToColor(55)).toBe('yellow')
    })

    it('returns orange for scores 20-39', () => {
      expect(scoreToColor(20)).toBe('orange')
      expect(scoreToColor(39)).toBe('orange')
    })

    it('returns red for scores < 20', () => {
      expect(scoreToColor(0)).toBe('red')
      expect(scoreToColor(19)).toBe('red')
    })

    it('handles boundary values exactly', () => {
      expect(scoreToColor(70)).toBe('green')
      expect(scoreToColor(69)).toBe('yellow')
      expect(scoreToColor(40)).toBe('yellow')
      expect(scoreToColor(39)).toBe('orange')
      expect(scoreToColor(20)).toBe('orange')
      expect(scoreToColor(19)).toBe('red')
    })
  })

  describe('determineTrend (imported from real source)', () => {
    it('returns improving when delta > 5', () => {
      expect(determineTrend(80, 70)).toBe('improving')
      expect(determineTrend(50, 30)).toBe('improving')
      expect(determineTrend(6, 0)).toBe('improving')
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
    })
  })
})
