import { getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

// The invite link to a list (made, or the maker's still-fresh one reused): sharing a list is only by link
export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid list id' })
    }
    try {
        return await apiClient(`/grocery-list/${id}/invite-link`, { method: 'POST' }, token)
    } catch (error: any) {
        throw createError({
            statusCode: error?.status || 500,
            statusMessage: error?.status === 401 ? 'Unauthorized' : undefined,
            message: error?.data?.message,
        })
    }
});
