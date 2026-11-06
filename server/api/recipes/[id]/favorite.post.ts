import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

// Favourites are personal: a star in a shared cookbook doesn't change it for the others
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const { favorite } = await readBody<{ favorite: boolean }>(event)
    try {
        return await apiClient(`/recipes/${id}/favorite`, { method: 'POST', body: { favorite: Boolean(favorite) } }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
