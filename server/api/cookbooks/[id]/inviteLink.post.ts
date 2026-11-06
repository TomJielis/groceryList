import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

// The invite link to a cookbook (made, or the maker's still-fresh one reused), like a list's
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    try {
        return await apiClient(`/cookbooks/${id}/invite-link`, { method: 'POST' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
