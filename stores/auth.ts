import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    token: null as string | null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setLanguage(language: string) {
        if (this.user) {
            this.user.language = language;
        }
    },
    setToken(token: string) {
      this.token = token;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
    },
  },
  persist: true,
})
