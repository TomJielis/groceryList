import {useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';

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
                },
                body: JSON.stringify(userData),
            });

            if (!loginResponse.ok) {
                throw new Error(`Failed to register user: ${loginResponse.statusText}`);
            }

           return await loginResponse.json();
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    async function fetchUser() {
        try {
            const response = await fetch('/api/user/');
            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.statusText}`);
            }
            const data = await response.json()
            authStore.setUser(data.user) ;
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    return {
        login,
        register,
    }
}