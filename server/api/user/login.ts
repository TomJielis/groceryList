import { useAuthStore } from "~/stores/auth";
import { setCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
type TUser = {
    id:number,
    email: string,
    password: any,
    name: any,
    created_at: string,
    updated_at: string,
}
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
            secure: process.env.NODE_ENV === 'production',
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