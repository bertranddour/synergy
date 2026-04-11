import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import en from '../../public/locales/en.json'

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'synergy-locale',
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    // Inline English for instant first paint — no async fetch needed
    resources: {
      en: { translation: en },
    },
    // Don't load English from backend since it's inlined
    partialBundledLanguages: true,
  })

export default i18n
