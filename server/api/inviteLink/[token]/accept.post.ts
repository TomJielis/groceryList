import { getCookie, readBody } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

// Joins the list (or cookbook) an invite link invites to; answers { data: { type, id, name, already_member } }
export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const linkToken = encodeURIComponent(getRouterParam(event, 'token') || '');
    try {
        const body = await readBody(event).catch(() => ({}))
        // bringMenuId: a week menu link, and the user's own menu whose dishes go along
        const bringMenuId = Number(body?.bringMenuId) || undefined
        return await apiClient(`/invite-links/${linkToken}/accept?supports=week_menu`, { method: 'POST', body: bringMenuId ? { bring_menu_id: bringMenuId } : undefined }, token)
    } catch (error: any) {
        throw createError({
            statusCode: error?.status || 500,
            statusMessage: error?.status === 401 ? 'Unauthorized' : undefined,
            message: error?.data?.message,
        })
    }
});
