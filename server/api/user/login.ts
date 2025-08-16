import { useAuthStore } from "~/stores/auth";
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
    // const authStore = useAuthStore();
    let body = await readBody(event);
    const {email, password} = body;
    try {
        const response = await fetch('http://grocerylistapi.test/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Failed to login with user: ${response.statusText}`);
        }

        const user = await response.json();

        setCookie(event, 'token', user.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })

        return {
            success: true,
            user: user.user,
            token: user.access_token,
        };
    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});