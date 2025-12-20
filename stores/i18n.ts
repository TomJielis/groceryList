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
        console.log('Using database language:', this.locale);
        return;
      }

      // If no user preference in database, detect browser language
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('nl')) {
          this.locale = 'nl';
          console.log('Using browser language: nl (detected from', browserLang + ')');
        } else {
          this.locale = 'en';
          console.log('Using browser language: en (detected from', browserLang + ')');
        }
      } else {
        // Default to English
        this.locale = 'en';
        console.log('Using default language: en');
      }
    }
  },
  persist: true,
})
