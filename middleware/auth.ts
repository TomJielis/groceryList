import {useAuthStore} from '~/stores/auth'
import {useRouter} from "vue-router";
import {useAuth} from "~/composables/useAuth";


export default defineNuxtRouteMiddleware((to, from) => {
    const router = useRouter();
    const authStore = useAuthStore();
    const {me} = useAuth();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    let user = authStore.user ?? null;

    if (token && !user) {

        me().then((data) => {
            if(data.success === false) {
                localStorage.removeItem('token');
                authStore.clearUser();
            }
            authStore.setUser(data.user);
            user = authStore.user;
        }).catch((error) => {
            typeof window !== 'undefined' ? localStorage.removeItem('token') : null;
            authStore.clearUser();
            return router.push('/auth/login')
        });


    }


    if (!user && !token) {
        return router.push('/auth/login')
    }
});