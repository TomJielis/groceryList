import { getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

// Joins the list (or cookbook) an invite link invites to; answers { data: { type, id, name, already_member } }
export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const linkToken = encodeURIComponent(getRouterParam(event, 'token') || '');
    try {
        return await apiClient(`/invite-links/${linkToken}/accept`, { method: 'POST' }, token)
    } catch (error: any) {
        throw createError({
            statusCode: error?.status || 500,
            statusMessage: error?.status === 401 ? 'Unauthorized' : undefined,
            message: error?.data?.message,
        })
    }
});
