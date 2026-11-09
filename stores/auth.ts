import { defineStore } from 'pinia';
import { useI18nStore } from '~/stores/i18n';
import { useSocket } from '~/composables/useSocket';

// The real token only lives in the httpOnly cookie, out of reach of scripts on the page. The store just remembers
// that there is a login, for the route checks.
const LOGGED_IN = 'cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    token: null as string | null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
      const i18n = useI18nStore();
      if (user?.language) {
        i18n.setLocale(user.language === 'nl' ? 'nl' : 'en');
      }
    },
    setLanguage(language: string) {
      if (this.user) {
        this.user.language = language;
        const i18n = useI18nStore();
        i18n.setLocale(language === 'nl' ? 'nl' : 'en');
      }
    },
    markLoggedIn() {
      this.token = LOGGED_IN;
    },
    clearAuth() {
      // The live updates connection logged in with this user: the next one starts with the next login
      useSocket().disconnect();
      this.user = null;
      this.token = null;
      const i18n = useI18nStore();
      i18n.setLocale('en'); // reset to English when logged out
    },
  },
  persist: {
    // Logins from before the token moved out of the browser's storage: replaces what is saved there
    afterHydrate: (context) => {
      if (context.store.token && context.store.token !== LOGGED_IN) context.store.token = LOGGED_IN;
    },
  },
})
