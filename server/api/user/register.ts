export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {name, email, password} = body;

    try {
        const response = await fetch('http://grocerylistapi.test/api/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error(`Failed to register user: ${response.statusText}`);
        }


    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});