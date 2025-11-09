import { defineStore } from 'pinia'
import en from '~/data/i18n/en.json'
import nl from '~/data/i18n/nl.json'

export type Locale = 'nl' | 'en'

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: 'en' as Locale,
  }),
  getters: {
    t: (state) => {
      return (key: string): any => {
        const dict = state.locale === 'nl' ? (nl as any) : (en as any)
        // support nested keys like 'nav.login'
        const value = key.split('.').reduce((obj: any, k: string) => (obj && obj[k] !== undefined ? obj[k] : undefined), dict)
        if (typeof value === 'string' || Array.isArray(value)) return value
        // fallback to key if missing
        return key
      }
    }
  },
  actions: {
    setLocale(locale: Locale) {
      this.locale = locale
    }
  },
  persist: true,
})
