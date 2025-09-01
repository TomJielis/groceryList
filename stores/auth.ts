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
