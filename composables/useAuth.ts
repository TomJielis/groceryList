import {useAuthStore} from "~/stores/auth";

export function useAuth() {
    const authStore = useAuthStore();

    async function register(userData: { name: string, email: string, password: string, language: string, acceptedTerms: boolean }) {
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
            body: JSON.stringify({ token }),
        });

        if (!loginResponse.ok) {
            throw new Error(`Verification failed: ${loginResponse.statusText}`);
        }

        let result = await loginResponse.json();

        // Opening the link again is fine: the account is ready to use
        if (result.reason === 'already_verified') {
            return {...result, alreadyVerified: true};
        }

        if(!result.success)
        {
            throw Object.assign(new Error(result.message || 'Verification failed'), {reason: result.reason});
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

        // The reason (invalid_link, password_too_short, ...) becomes the error, for the page to translate
        if (result.success === false) {
            throw Object.assign(new Error(result.reason), {reason: result.reason});
        }

        return result;
    }

    async function checkResetLink(token: string): Promise<boolean> {
        const response = await fetch('/api/user/checkResetLink/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token}),
        });
        if (!response.ok) return true;
        const result = await response.json();
        return result.valid !== false;
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

    async function approveTerms() {
        const result = await fetch('/api/user/approveTerms/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!result.ok) {
            throw new Error(`Failed to approve terms: ${result.statusText}`);
        }

        return await result.json();
    }


    async function update(userData: { name: string }) {
    const updateResponse = await fetch('/api/user/update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to login user: ${updateResponse.statusText}`);
    }

    return await updateResponse.json();
  }

    async function deactivate() {
        const updateResponse = await fetch('/api/user/deactivate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to login user: ${updateResponse.statusText}`);
        }

        return await updateResponse.json();
    }

    async function me(){
        const updateResponse = await fetch('/api/user/me/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to login user: ${updateResponse.statusText}`);
        }

        return await updateResponse.json();
    }

    return {
        login,
        register,
        verifyEmail,
        checkResetLink,
        resetPassword,
        setNewPassword,
        setLanguage,
        update,
        deactivate,
        approveTerms,
        me
    }
}