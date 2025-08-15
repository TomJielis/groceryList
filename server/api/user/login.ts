import { useAuthStore } from "~/stores/auth";
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password} = body;
    const authStore = useAuthStore();
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
        console.log(user);
        authStore.setUser(user.user);
        authStore.setToken(user.access_token);
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