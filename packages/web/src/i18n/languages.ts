export const SUPPORTED_LOCALE_CODES = ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALE_CODES)[number]

export const SUPPORTED_LANGUAGES: Array<{ code: SupportedLocale; nativeName: string }> = [
  { code: 'en', nativeName: 'English' },
  { code: 'fr', nativeName: 'Fran\u00e7ais' },
  { code: 'es', nativeName: 'Espa\u00f1ol' },
  { code: 'pt', nativeName: 'Portugu\u00eas' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'nl', nativeName: 'Nederlands' },
]

/** Map a browser locale (e.g. "fr-FR", "pt-BR") to a supported locale code */
export function mapBrowserLocale(browserLang: string): SupportedLocale {
  const lower = browserLang.toLowerCase()
  // Exact match first
  const exact = SUPPORTED_LOCALE_CODES.find((c) => c === lower)
  if (exact) return exact
  // Prefix match (e.g. "fr-FR" → "fr")
  const prefix = lower.split('-')[0]
  const match = SUPPORTED_LOCALE_CODES.find((c) => c === prefix)
  return match ?? 'en'
}
