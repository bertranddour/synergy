import i18n from 'i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportedLocale } from '../i18n/languages'

interface LocaleState {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
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
