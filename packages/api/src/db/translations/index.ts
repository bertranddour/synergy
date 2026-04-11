import type { FrameworkTranslation, ModeTranslation, ProgramTranslation } from '../schema.js'
import { deFrameworks } from './de/frameworks.js'
import { deModes } from './de/modes.js'
import { dePrograms } from './de/programs.js'
import { esFrameworks } from './es/frameworks.js'
import { esModes } from './es/modes.js'
import { esPrograms } from './es/programs.js'
import { frFrameworks } from './fr/frameworks.js'
import { frModes } from './fr/modes.js'
import { frPrograms } from './fr/programs.js'
import { itFrameworks } from './it/frameworks.js'
import { itModes } from './it/modes.js'
import { itPrograms } from './it/programs.js'
import { nlFrameworks } from './nl/frameworks.js'
import { nlModes } from './nl/modes.js'
import { nlPrograms } from './nl/programs.js'
import { ptFrameworks } from './pt/frameworks.js'
import { ptModes } from './pt/modes.js'
import { ptPrograms } from './pt/programs.js'

type LocaleMap<T> = Record<string, T>

const MODE_TRANSLATIONS: Record<string, LocaleMap<ModeTranslation>> = {}
const FRAMEWORK_TRANSLATIONS: Record<string, LocaleMap<FrameworkTranslation>> = {}
const PROGRAM_TRANSLATIONS: Record<string, LocaleMap<ProgramTranslation>> = {}

// Merge all locale data by slug
const localeModeMaps = [
  { locale: 'fr', data: frModes },
  { locale: 'es', data: esModes },
  { locale: 'pt', data: ptModes },
  { locale: 'it', data: itModes },
  { locale: 'de', data: deModes },
  { locale: 'nl', data: nlModes },
]

for (const { locale, data } of localeModeMaps) {
  for (const [slug, translation] of Object.entries(data)) {
    MODE_TRANSLATIONS[slug] ??= {}
    MODE_TRANSLATIONS[slug][locale] = translation
  }
}

const localeFrameworkMaps = [
  { locale: 'fr', data: frFrameworks },
  { locale: 'es', data: esFrameworks },
  { locale: 'pt', data: ptFrameworks },
  { locale: 'it', data: itFrameworks },
  { locale: 'de', data: deFrameworks },
  { locale: 'nl', data: nlFrameworks },
]

for (const { locale, data } of localeFrameworkMaps) {
  for (const [slug, translation] of Object.entries(data)) {
    FRAMEWORK_TRANSLATIONS[slug] ??= {}
    FRAMEWORK_TRANSLATIONS[slug][locale] = translation
  }
}

const localeProgramMaps = [
  { locale: 'fr', data: frPrograms },
  { locale: 'es', data: esPrograms },
  { locale: 'pt', data: ptPrograms },
  { locale: 'it', data: itPrograms },
  { locale: 'de', data: dePrograms },
  { locale: 'nl', data: nlPrograms },
]

for (const { locale, data } of localeProgramMaps) {
  for (const [slug, translation] of Object.entries(data)) {
    PROGRAM_TRANSLATIONS[slug] ??= {}
    PROGRAM_TRANSLATIONS[slug][locale] = translation
  }
}

/** Get all locale translations for a mode, keyed by locale */
export function getModeTranslations(slug: string): Record<string, ModeTranslation> | undefined {
  return MODE_TRANSLATIONS[slug]
}

/** Get all locale translations for a framework, keyed by locale */
export function getFrameworkTranslations(slug: string): Record<string, FrameworkTranslation> | undefined {
  return FRAMEWORK_TRANSLATIONS[slug]
}

/** Get all locale translations for a program, keyed by locale */
export function getProgramTranslations(slug: string): Record<string, ProgramTranslation> | undefined {
  return PROGRAM_TRANSLATIONS[slug]
}
