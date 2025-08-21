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

        setCookie(event, 'token', response.access_token, {
            httpOnly: true,
            secure: false,
            path: '/',
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