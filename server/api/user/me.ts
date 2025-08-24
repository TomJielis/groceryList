import {getCookie, setCookie} from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import type { TUser } from '~/types/TUser'

type LoginResponse<T> = {
    user: TUser;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const token = getCookie(event, 'token')
    try {
        const response: LoginResponse<any> = await apiClient('/me', {
            method: 'POST',
        }, token);

        event.res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        event.res.setHeader('Access-Control-Allow-Credentials', 'true')

        return {
            success: true,
            user: response.user,
        };
    } catch (error) {
        console.error('Error during user registration:', error);
        return {
            success: false,
        };
    }
});