import {useAuthStore} from "~/stores/auth";
import {useRouter} from 'vue-router';

export function useAuth() {
    const authStore = useAuthStore();

    async function register(userData: { name: string, email: string, password: string }) {
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

        const result = await registerResponse.json();
        console.log(result);
        if (!result.user) {
            console.log(result);
            throw new Error(result.error || 'Register error');
        }
        authStore.setUser(result.user); // Update user state with returned data

        return result;
    }

    async function login(userData: { email: string, password: string }) {
        const loginResponse = await fetch('/api/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'withCredentials': 'true', // Ensure cookies are sent with the request
            },
            body: JSON.stringify(userData),
        });

        if (!loginResponse.ok) {
            throw new Error(`Failed to login user: ${loginResponse.statusText}`);
        }

        let result = await loginResponse.json();

        if (!result.user) {
            throw new Error(result.error || 'Login failed');
        }

        return result;
    }

    return {
        login,
        register,
    }
}