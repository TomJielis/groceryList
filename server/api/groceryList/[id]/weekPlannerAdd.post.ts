import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

// Puts several products on a list at once ({ items: [{ name, quantity }] }): an open product gets the quantity added,
// the rest is new. Used by the week menu's "put the week on my list".
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const body = await readBody(event).catch(() => ({}))
    try {
        return await apiClient(`/grocery-list/${id}/week-planner/add`, { method: 'POST', body: { items: body?.items ?? [] } }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
