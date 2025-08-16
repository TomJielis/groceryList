import { useAuthStore } from '~/stores/auth'
export default defineNuxtRouteMiddleware((to, from) => {

    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) {
        return navigateTo('/auth/login');
    }
});