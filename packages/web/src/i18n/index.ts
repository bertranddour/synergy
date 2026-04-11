import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import en from '../../public/locales/en.json'

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
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
