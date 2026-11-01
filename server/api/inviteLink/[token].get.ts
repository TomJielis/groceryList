import { apiClient } from "~/server/api/utils/apiClient";

// What an invite link invites to, for the page someone without the app lands on (no login needed)
export default defineEventHandler(async (event) => {
    const token = encodeURIComponent(getRouterParam(event, 'token') || '');
    try {
        return await apiClient('/invite-links/' + token, { method: 'GET' }, undefined);
    } catch {
        return { data: { status: 'error' } };
    }
});
