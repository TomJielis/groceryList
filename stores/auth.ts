import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { id: string; name: string } | null,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setUser(user: { id: string; name: string }) {
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
});