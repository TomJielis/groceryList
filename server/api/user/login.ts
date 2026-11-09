import {setCookie} from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";
import {forwardedForHeader} from "~/server/api/utils/visitorAddress";
import type {TUser} from '~/types/TUser'

type LoginResponse<T> = {
    user: TUser;
    access_token: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password} = body;
    const response: LoginResponse<any> = await apiClient('/login', {
        method: 'POST',
        headers: forwardedForHeader(event),
        body: {email, password},
    }, undefined);

    if (!response.user) {
        return response;
    }

    setCookie(event, 'token', response.access_token, {
        httpOnly: true,
        secure: !import.meta.dev, // The website is on HTTPS; the dev server on plain localhost
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 28, // 4 weeks
    });

    event.res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    event.res.setHeader('Access-Control-Allow-Credentials', 'true')

    return {
        success: true,
        user: response.user,
    };
});