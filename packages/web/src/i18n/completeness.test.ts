// @vitest-environment node
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = resolve(currentDir, '../../public/locales')
const LANGUAGES = ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl'] as const

function loadJson(lang: string): Record<string, unknown> {
  const content = readFileSync(resolve(LOCALES_DIR, `${lang}.json`), 'utf-8')
  return JSON.parse(content) as Record<string, unknown>
}

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function extractInterpolationVars(value: string): string[] {
  const matches = value.match(/\{\{(\w+)\}\}/g)
  return matches ? matches.sort() : []
}

describe('translation completeness', () => {
  const enData = loadJson('en')
  const enKeys = flattenKeys(enData).sort()

  it('English file has no empty values', () => {
    for (const key of enKeys) {
      const parts = key.split('.')
      let current: unknown = enData
      for (const part of parts) {
        current = (current as Record<string, unknown>)[part]
      }
      expect(current, `en.${key} is empty`).not.toBe('')
    }
  })

  for (const lang of LANGUAGES) {
    if (lang === 'en') continue

    describe(`${lang} translations`, () => {
      const langData = loadJson(lang)
      const langKeys = flattenKeys(langData).sort()

      it('has all keys from English', () => {
        const missing = enKeys.filter((k) => !langKeys.includes(k))
        expect(missing, `Missing keys in ${lang}`).toEqual([])
      })

      it('has no extra keys', () => {
        const extra = langKeys.filter((k) => !enKeys.includes(k))
        expect(extra, `Extra keys in ${lang}`).toEqual([])
      })

      it('has no empty values', () => {
        for (const key of langKeys) {
          const parts = key.split('.')
          let current: unknown = langData
          for (const part of parts) {
            current = (current as Record<string, unknown>)[part]
          }
          expect(current, `${lang}.${key} is empty`).not.toBe('')
        }
      })

      it('preserves interpolation variables', () => {
        for (const key of enKeys) {
          const enParts = key.split('.')
          let enVal: unknown = enData
          for (const part of enParts) {
            enVal = (enVal as Record<string, unknown>)[part]
          }
          if (typeof enVal !== 'string') continue

          const enVars = extractInterpolationVars(enVal)
          if (enVars.length === 0) continue

          let langVal: unknown = langData
          for (const part of enParts) {
            langVal = (langVal as Record<string, unknown>)[part]
          }
          if (typeof langVal !== 'string') continue

          const langVars = extractInterpolationVars(langVal)
          expect(langVars, `${lang}.${key} interpolation mismatch`).toEqual(enVars)
        }
      })
    })
  }
})
