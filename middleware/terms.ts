import {useAuthStore} from '~/stores/auth'
import {termsOutdated} from '~/utils/termsVersion'

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;

    const authStore = useAuthStore()
    const user = authStore.user;
    const config = useRuntimeConfig();
    if (user && !user.accepted_terms) {
        return navigateTo('/terms/approve');
    }

    if (user && user.accepted_terms) {
        const acceptedVersion = user.accepted_terms_version || '1.0';
        const currentVersion = config.public.termsVersion;
        // A newer accepted version (accepted in a newer app) also counts: asking again would set it back
        if (termsOutdated(acceptedVersion, currentVersion)) {
            return navigateTo('/terms/approve');
        }
    }
})