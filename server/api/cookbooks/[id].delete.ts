import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

// The creator deletes it for everyone, with its recipes; someone it was shared with leaves it
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    try {
        return await apiClient(`/cookbooks/${id}/delete`, { method: 'DELETE' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
