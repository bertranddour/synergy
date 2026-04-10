import { describe, expect, it } from 'vitest'
import { fieldDefinitionSchema, modeListQuerySchema } from './modes'

describe('mode schemas', () => {
  describe('fieldDefinitionSchema', () => {
    it('accepts valid text field', () => {
      const result = fieldDefinitionSchema.safeParse({
        name: 'Assumption',
        description: 'The belief to test',
        type: 'textarea',
        required: true,
        example: 'Users will pay $49/month',
      })
      expect(result.success).toBe(true)
    })

    it('accepts select field with options', () => {
      const result = fieldDefinitionSchema.safeParse({
        name: 'Risk Level',
        description: 'Impact if wrong',
        type: 'select',
        required: true,
        options: ['High', 'Medium', 'Low'],
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid field type', () => {
      const result = fieldDefinitionSchema.safeParse({
        name: 'Test',
        description: 'Test',
        type: 'invalid',
        required: true,
      })
      expect(result.success).toBe(false)
    })

    it('defaults required to true', () => {
      const result = fieldDefinitionSchema.safeParse({
        name: 'Test',
        description: 'Test',
        type: 'text',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.required).toBe(true)
      }
    })
  })

  describe('modeListQuerySchema', () => {
    it('accepts empty query', () => {
      expect(modeListQuerySchema.safeParse({}).success).toBe(true)
    })

    it('accepts framework filter', () => {
      const result = modeListQuerySchema.safeParse({ framework: 'core' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid framework', () => {
      const result = modeListQuerySchema.safeParse({ framework: 'invalid' })
      expect(result.success).toBe(false)
    })

    it('accepts search parameter', () => {
      const result = modeListQuerySchema.safeParse({ search: 'validation' })
      expect(result.success).toBe(true)
    })

    it('coerces recommended boolean', () => {
      const result = modeListQuerySchema.safeParse({ recommended: 'true' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.recommended).toBe(true)
      }
    })
  })
})
