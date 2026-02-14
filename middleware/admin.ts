import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;

  const authStore = useAuthStore()

  // Check if user is logged in and is admin
  if (!authStore.user?.is_admin) {
    return navigateTo('/')
  }
})
