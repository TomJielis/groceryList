import { defineStore } from 'pinia'
import en from '~/data/i18n/en.json'
import nl from '~/data/i18n/nl.json'
import { useAuthStore } from '~/stores/auth'

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
    },
    initLocale() {
      const auth = useAuthStore();
        // If user has a preference in database, use it
        if (auth.user?.language === 'nl' || auth.user?.language === 'en') {
            this.locale = auth.user.language;
            return;
        }

        if (typeof navigator !== 'undefined') {
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('nl')) {
                this.locale = 'nl';
            } else {
                this.locale = 'en';
            }
        } else {
            this.locale = 'en';
        }
    }
  },
  persist: true,
})
