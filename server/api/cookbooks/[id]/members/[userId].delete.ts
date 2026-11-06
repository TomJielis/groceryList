import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'
import type { TCookbook } from '~/types/TCookbook'

// The creator removes someone; the cookbook and its recipes stay
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const userId = idParam(getRouterParam(event, 'userId'))
    try {
        return await apiClient<TCookbook>(`/cookbooks/${id}/members/${userId}`, { method: 'DELETE' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
