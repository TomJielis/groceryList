import { setCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import type { TUser } from '~/types/TUser'

type LoginResponse<T> = {
    user: TUser;
    access_token: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password} = body;
    try {
        const response: LoginResponse<any> = await apiClient('/login', {
            method: 'POST',
            body: { email, password },
        }, undefined);

        console.log('new coockie');
        console.log('coockie token ' + response.access_token);
        setCookie(event, 'token', response.access_token, {
            httpOnly: true,
            secure: false, // Use true only if HTTPS is enabled
            path: '/',
            sameSite: 'lax', // Allows cookies for same-site requests and top-level navigation
            domain: 'localhost', // Set the domain to match the frontend
        })

        return {
            success: true,
            user: response.user,
            token: response.access_token,
        };
    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});