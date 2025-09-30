import {useAuthStore} from "~/stores/auth";

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
        if (!result.user) {
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

    async function verifyEmail(token: string) {
        const loginResponse = await fetch('/api/user/verify-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token),
        });

        if (!loginResponse.ok) {
            throw new Error(`Verification failed: ${loginResponse.statusText}`);
        }

        let result = await loginResponse.json();

        if(!result.success)
        {
            throw new Error(result.message || 'Verification failed');
        }

        return result;
    }

    async function resetPassword(userData: { email: string }) {
        const resetPasswordResponse = await fetch('/api/user/resetPassword/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!resetPasswordResponse.ok) {
            throw new Error(`Failed to login user: ${resetPasswordResponse.statusText}`);
        }

        let result = await resetPasswordResponse.json();

        return result;
    }

    async function setNewPassword(userData: { email: string, password: string, repeatPassword: string, token: string }) {
        const resetPasswordResponse = await fetch('/api/user/setNewPassword/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!resetPasswordResponse.ok) {
            throw new Error(`Failed to login user: ${resetPasswordResponse.statusText}`);
        }

        let result = await resetPasswordResponse.json();

        // if (!result.user) {
        //     throw new Error(result.error || 'Login failed');
        // }

        return result;
    }

    async function setLanguage(language: string) {
        const upateLanguageResponse = await fetch('/api/user/updateLanguage/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(language),
        });

        if (!upateLanguageResponse.ok) {
            throw new Error(`Failed to login user: ${upateLanguageResponse.statusText}`);
        }

        return await upateLanguageResponse.json();
    }




    return {
        login,
        register,
        verifyEmail,
        resetPassword,
        setNewPassword,
        setLanguage
    }
}