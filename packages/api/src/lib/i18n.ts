export type SupportedLocale = 'en' | 'fr' | 'es' | 'pt' | 'it' | 'de' | 'nl'

/**
 * Resolve translated content from a DB entity.
 *
 * English content lives in the regular columns (the base).
 * Non-English translations are in the `translations` JSON column.
 * Returns the entity without the `translations` field, with fields
 * overridden by the locale-specific translation if available.
 */
export function resolveContent<
  T extends Record<string, unknown> & { translations?: Record<string, Partial<T>> | null },
>(entity: T, locale: string): Omit<T, 'translations'> {
  const { translations, ...base } = entity
  if (locale === 'en' || !translations) {
    return base
  }
  const localeData = translations[locale]
  if (!localeData) {
    return base
  }
  return { ...base, ...localeData }
}
