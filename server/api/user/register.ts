import {apiClient} from "~/server/api/utils/apiClient";
import {forwardedForHeader} from "~/server/api/utils/visitorAddress";
import {setCookie} from "h3";
import type {TUser} from "~/types/TUser";

type RegisterResponse<T> = {
    user: TUser;
    access_token: string;
};

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const config = useRuntimeConfig()
    const {name, email, password, language, acceptedTerms} = body;

    const response: RegisterResponse<any> = await apiClient('/register', {
        method: 'POST',
        headers: forwardedForHeader(event),
        body: {
            name,
            email,
            password,
            language,
            acceptedTerms,
            acceptedTermsVersion: config.public.termsVersion,
        },
    }, undefined)

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

    return {
        success: true,
        user: response.user,
    };


});