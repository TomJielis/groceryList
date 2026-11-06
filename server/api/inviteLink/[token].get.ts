import { getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

// What an invite link invites to (no login needed). Logged in, the API also says whether you're already a member.
export default defineEventHandler(async (event) => {
    const token = encodeURIComponent(getRouterParam(event, 'token') || '');
    const userToken = getCookie(event, 'token');
    try {
        return await apiClient('/invite-links/' + token, { method: 'GET' }, userToken);
    } catch {
        return { data: { status: 'error' } };
    }
});
