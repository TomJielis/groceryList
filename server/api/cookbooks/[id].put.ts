import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'
import type { TCookbook } from '~/types/TCookbook'

// Renaming: only the creator may (the API answers 403 otherwise)
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const { name } = await readBody<{ name: string }>(event)
    try {
        return await apiClient<TCookbook>(`/cookbooks/${id}/update`, { method: 'POST', body: { name } as any }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
