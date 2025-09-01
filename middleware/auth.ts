import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return // 💡 middleware mag niets doen op de server

    const authStore = useAuthStore()
    if (!authStore.token) {
        return navigateTo('/auth/login')
    }
})
