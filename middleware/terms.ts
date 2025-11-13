import {useAuthStore} from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const authStore = useAuthStore()
    const user = authStore.user;
    const config = useRuntimeConfig();
    if (user && !user.accepted_terms) {
        return navigateTo('/terms/approve');
    }

    if (user && user.accepted_terms) {
        const acceptedVersion = user.accepted_terms_version || '1.0';
        const currentVersion = config.public.termsVersion;
        if (acceptedVersion !== currentVersion) {
            return navigateTo('/terms/approve');
        }
    }
})