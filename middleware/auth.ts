import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const authStore = useAuthStore()

  // If no token and not already on auth/info pages, redirect to login
  if (!authStore.token) {
    // Prevent redirect loops - check if already on auth pages
    const isOnAuthPage = to.path.includes('/auth/') || to.path === '/information'

    if (!isOnAuthPage) {
      return navigateTo('/information')
    }
  }
})