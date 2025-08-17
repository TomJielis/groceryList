import { useAuthStore } from '~/stores/auth'
import { useRouter} from "vue-router";

export default defineNuxtRouteMiddleware((to, from) => {
    const router = useRouter();
    const authStore = useAuthStore();
    const user = authStore.user;
    if (!user) {
        return router.push('/auth/login')
    }
});