import { describe, it, expect } from 'vitest'
import { frameworkSeeds, modeSeeds, programSeeds } from './seed'

describe('seed data', () => {
  describe('frameworks', () => {
    it('has exactly 4 frameworks', () => {
      expect(frameworkSeeds).toHaveLength(4)
    })

    it('has correct slugs', () => {
      const slugs = frameworkSeeds.map((f) => f.slug)
      expect(slugs).toEqual(['core', 'air', 'max', 'synergy'])
    })

    it('all frameworks have required fields', () => {
      for (const fw of frameworkSeeds) {
        expect(fw.id).toBeTruthy()
        expect(fw.slug).toBeTruthy()
        expect(fw.name).toBeTruthy()
        expect(fw.description).toBeTruthy()
        expect(fw.color).toMatch(/^#[0-9A-F]{6}$/i)
        expect(fw.modeCount).toBeGreaterThan(0)
      }
    })
  })

  describe('modes', () => {
    it('has exactly 29 modes', () => {
      expect(modeSeeds).toHaveLength(29)
    })

    it('has 7 Core modes', () => {
      expect(modeSeeds.filter((m) => m.frameworkId === 'fw-core')).toHaveLength(7)
    })

    it('has 7 Air modes', () => {
      expect(modeSeeds.filter((m) => m.frameworkId === 'fw-air')).toHaveLength(7)
    })

    it('has 8 Max modes', () => {
      expect(modeSeeds.filter((m) => m.frameworkId === 'fw-max')).toHaveLength(8)
    })

    it('has 7 Synergy modes', () => {
      expect(modeSeeds.filter((m) => m.frameworkId === 'fw-synergy')).toHaveLength(7)
    })

    it('all modes have unique slugs', () => {
      const slugs = modeSeeds.map((m) => m.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('all modes have unique IDs', () => {
      const ids = modeSeeds.map((m) => m.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all modes have 8 standard fields populated', () => {
      for (const mode of modeSeeds) {
        expect(mode.name).toBeTruthy()
        expect(mode.purpose).toBeTruthy()
        expect(mode.trigger).toBeTruthy()
        expect(mode.fieldsSchema.length).toBeGreaterThan(0)
        expect(mode.doneSignal).toBeTruthy()
        expect(mode.flowName).toBeTruthy()
        expect(mode.timeEstimateMinutes).toBeGreaterThan(0)
        // aiCoachPrompts and composabilityHooks can be empty arrays
        expect(Array.isArray(mode.aiCoachPrompts)).toBe(true)
        expect(Array.isArray(mode.composabilityHooks)).toBe(true)
        expect(Array.isArray(mode.metricsSchema)).toBe(true)
      }
    })

    it('all field schemas have required properties', () => {
      for (const mode of modeSeeds) {
        for (const field of mode.fieldsSchema) {
          expect(field.name).toBeTruthy()
          expect(field.description).toBeTruthy()
          expect(['text', 'textarea', 'select', 'number', 'toggle', 'structured']).toContain(field.type)
          expect(typeof field.required).toBe('boolean')
        }
      }
    })

    it('select fields have options', () => {
      for (const mode of modeSeeds) {
        for (const field of mode.fieldsSchema) {
          if (field.type === 'select') {
            expect(field.options).toBeDefined()
            expect(field.options!.length).toBeGreaterThan(0)
          }
        }
      }
    })
  })

  describe('training programs', () => {
    it('has exactly 5 programs', () => {
      expect(programSeeds).toHaveLength(5)
    })

    it('all programs have unique slugs', () => {
      const slugs = programSeeds.map((p) => p.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    })

    it('all programs have a mode sequence', () => {
      for (const program of programSeeds) {
        expect(program.modeSequence.length).toBeGreaterThan(0)
        for (const step of program.modeSequence) {
          expect(step.day).toBeGreaterThan(0)
          expect(step.modeSlug).toBeTruthy()
          expect(step.description).toBeTruthy()
        }
      }
    })

    it('all program mode slugs reference existing modes', () => {
      const modeSlugs = new Set(modeSeeds.map((m) => m.slug))
      for (const program of programSeeds) {
        for (const step of program.modeSequence) {
          expect(modeSlugs.has(step.modeSlug)).toBe(true)
        }
      }
    })

    it('programs have valid durations', () => {
      for (const program of programSeeds) {
        expect(program.durationDays).toBeGreaterThan(0)
        const maxDay = Math.max(...program.modeSequence.map((s) => s.day))
        expect(maxDay).toBeLessThanOrEqual(program.durationDays)
      }
    })
  })
})
