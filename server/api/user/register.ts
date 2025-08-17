import { apiClient } from '~/server/api/utils/apiClient'

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {name, email, password} = body;

    try {
        const response = await apiClient('/register', {
            method: 'POST',
            body: { name, email, password },
        },undefined)
    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});