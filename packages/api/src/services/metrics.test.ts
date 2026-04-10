import { describe, expect, it } from 'vitest'
import { MODE_CATEGORY_MAP, OPERATIONAL_MODES } from './metrics'

describe('metrics service (imported from real source)', () => {
  describe('MODE_CATEGORY_MAP', () => {
    it('maps framework IDs to health categories', () => {
      expect(MODE_CATEGORY_MAP['fw-core']).toBe('validation')
      expect(MODE_CATEGORY_MAP['fw-air']).toBe('team')
      expect(MODE_CATEGORY_MAP['fw-max']).toBe('scaling')
      expect(MODE_CATEGORY_MAP['fw-synergy']).toBe('ai-collaboration')
    })

    it('has exactly 4 framework mappings', () => {
      expect(Object.keys(MODE_CATEGORY_MAP)).toHaveLength(4)
    })

    it('returns undefined for unknown framework IDs', () => {
      expect(MODE_CATEGORY_MAP['unknown']).toBeUndefined()
    })
  })

  describe('OPERATIONAL_MODES', () => {
    it('identifies all 6 operational modes', () => {
      expect(OPERATIONAL_MODES.has('execution-tracker')).toBe(true)
      expect(OPERATIONAL_MODES.has('delivery-check')).toBe(true)
      expect(OPERATIONAL_MODES.has('priority-stack')).toBe(true)
      expect(OPERATIONAL_MODES.has('dashboard')).toBe(true)
      expect(OPERATIONAL_MODES.has('scaled-execution')).toBe(true)
      expect(OPERATIONAL_MODES.has('quality-matrix')).toBe(true)
    })

    it('has exactly 6 operational modes', () => {
      expect(OPERATIONAL_MODES.size).toBe(6)
    })

    it('does not include non-operational modes', () => {
      expect(OPERATIONAL_MODES.has('validation')).toBe(false)
      expect(OPERATIONAL_MODES.has('team-rhythm')).toBe(false)
      expect(OPERATIONAL_MODES.has('ai-onboarding')).toBe(false)
    })
  })
})
