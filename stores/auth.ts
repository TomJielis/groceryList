import { defineStore } from 'pinia'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(data:any) {
      this.user = data;
    },
    clearUser() {
        this.user = null;
    }
  }
})