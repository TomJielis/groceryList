import {useAuthStore} from "~/stores/auth";

export function useAuth() {
    const csrfToken = computed(() => localStorage.getItem('csrfToken') || null);
    let user = computed(() => localStorage.getItem('user') || null);
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
            user = data.user; // Update user state with returned data
            localStorage.setItem('user', JSON.stringify(data.user));
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

           await loginResponse.json();
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
            user = await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    function logout(){
        user = null;
        localStorage.removeItem('user');
        localStorage.removeItem('csrfToken');

        authStore.clearAuth();
        window.location.href = '/';
    }


    return {
        user,
        csrfToken,
        login,
        logout,
        register,
    }
}