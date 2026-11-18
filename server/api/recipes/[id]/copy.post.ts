import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'

// "Save in my cookbook": an own copy of a recipe someone planned in a week menu ({ cookbookId })
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const body = await readBody(event).catch(() => ({}))
    try {
        return await apiClient(`/recipes/${id}/copy`, { method: 'POST', body: { cookbook_id: body?.cookbookId } }, getCookie(event, 'token'))
    } catch (error: any) {
        // Saved before: which copy (or own recipe) it is, so the page can open it (the page reads error.data.data)
        if (error?.status === 409) {
            throw createError({ statusCode: 409, message: error?.data?.message, data: error?.data?.data })
        }
        throw apiError(error)
    }
})
