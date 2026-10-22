import {getRequestHeader, setCookie} from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";
import type {TUser} from '~/types/TUser'

type LoginResponse<T> = {
    user: TUser;
    access_token: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password} = body;
    // The API sees this server as the caller; pass on who really logged in (for failed-login records).
    // In production the Cloudflare tunnel connects from this machine and puts the visitor's address in
    // CF-Connecting-IP. That header is only believed from the tunnel itself, so a visitor can't fake it.
    // (No address at all means a local socket, e.g. the dev server passing the request on internally.)
    const socketAddress = event.node.req.socket.remoteAddress ?? '';
    const fromThisMachine = ['', '127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(socketAddress);
    const visitorAddress = (fromThisMachine && getRequestHeader(event, 'cf-connecting-ip')) || socketAddress;
    const response: LoginResponse<any> = await apiClient('/login', {
        method: 'POST',
        headers: visitorAddress ? {'X-Forwarded-For': visitorAddress} : {},
        body: {email, password},
    }, undefined);

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

    event.res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    event.res.setHeader('Access-Control-Allow-Credentials', 'true')

    return {
        success: true,
        user: response.user,
        token: response.access_token,
    };
});