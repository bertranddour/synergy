import i18n from 'i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportedLocale } from '../i18n/languages'
import { mapBrowserLocale } from '../i18n/languages'

/** Detect browser language on first visit (no stored preference) */
function detectInitialLocale(): SupportedLocale {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return mapBrowserLocale(navigator.language)
  }
  return 'en'
}

interface LocaleState {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: detectInitialLocale(),
      setLocale: (locale) => {
        set({ locale })
        applyLocale(locale)
      },
    }),
    {
      name: 'synergy-locale',
      onRehydrateStorage: () => (state) => {
        if (state) applyLocale(state.locale)
      },
    },
  ),
)

function applyLocale(locale: SupportedLocale) {
  document.documentElement.lang = locale
  if (i18n.isInitialized && i18n.language !== locale) {
    void i18n.changeLanguage(locale)
  }
}
