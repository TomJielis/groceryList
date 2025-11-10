import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const authStore = useAuthStore()

  if (!authStore.token) {
    return navigateTo('/information')
  }
})