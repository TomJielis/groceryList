import {useAuthStore} from "~/stores/auth";
import { useRouter } from "vue-router";
export function useAuth() {
    const authStore = useAuthStore();

    async function register(userData: { name: string, email: string, password: string }) {
        try {
            const registerResponse = await fetch('/api/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!registerResponse.ok) {
                throw new Error(`Failed to register user: ${registerResponse.statusText}`);
            }

            const data = await registerResponse.json();
            authStore.setUser(data.user); // Update user state with returned data
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    async function login(userData: { email: string, password: string }) {
        try {
            const loginResponse = await fetch('/api/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'withCredentials': 'true', // Ensure cookies are sent with the request
                },
                body: JSON.stringify(userData),
            });

            if (!loginResponse.ok) {
                throw new Error(`Failed to register user: ${loginResponse.statusText}`);
            }

            const result = await loginResponse.json();
            localStorage.setItem('token', result.token);

            return result;
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    async function me() {
        try {
            const loginResponse = await fetch('/api/user/me/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (!loginResponse.ok) {
                throw new Error(`Failed to register user: ${loginResponse.statusText}`);
            }

            const result = await loginResponse.json();
            if (result.success === false) {
                const router = useRouter();
                localStorage.removeItem('token');
                authStore.clearUser();
                await router.push('/auth/login');
            }
            authStore.setUser(result.user);

            return result;
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    return {
        login,
        register,
        me
    }
}