import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    try {
        return await apiClient(`/recipes/${id}/delete`, { method: 'DELETE' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
