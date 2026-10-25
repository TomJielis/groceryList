import { defineStore } from 'pinia'
import en from '~/data/i18n/en.json'
import nl from '~/data/i18n/nl.json'
import { useAuthStore } from '~/stores/auth'

export type Locale = 'nl' | 'en'

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: 'en' as Locale,
    // Texts write the app's name as {app}, so renaming it is one setting (NUXT_PUBLIC_APP_NAME).
    // Read here because t is also called where Nuxt's composables aren't available
    appName: useRuntimeConfig().public.appName as string,
  }),
  getters: {
    t: (state) => {
      const withAppName = (text: string) => text.replaceAll('{app}', state.appName)
      return (key: string): any => {
        const dict = state.locale === 'nl' ? (nl as any) : (en as any)
        // support nested keys like 'nav.login'
        const value = key.split('.').reduce((obj: any, k: string) => (obj && obj[k] !== undefined ? obj[k] : undefined), dict)
        if (typeof value === 'string') return withAppName(value)
        if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? withAppName(v) : v))
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
  // Only the language: the app name always comes from the settings
  persist: { pick: ['locale'] },
})
