import {apiClient} from '~/server/api/utils/apiClient'
import {setCookie} from "h3";
import type {TUser} from "~/types/TUser";

type RegisterResponse<T> = {
    user: TUser;
    access_token: string;
};

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {name, email, password, language} = body;

    const response: RegisterResponse<any> = await apiClient('/register', {
        method: 'POST',
        body: {name, email, password, language},
    }, undefined)

    if (!response.user) {
        return response;
    }

    setCookie(event, 'token', response.access_token, {
        httpOnly: true,
        secure: false, // Set to true only if HTTPS is enabled
        path: '/',
        sameSite: 'lax', // Use 'lax' for development on localhost
        maxAge: 60 * 60 * 24 * 28, // 4 weeks
    });

    return {
        success: true,
        user: response.user,
        token: response.access_token,
    };


});