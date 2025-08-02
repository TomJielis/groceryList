export default defineEventHandler(async (event) => {
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
        return {
            success: true,
            user: user.user,
        };
    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});