import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'

// The cookbook new recipes go into from "All recipes", like the favourite list; null clears it
export default defineEventHandler(async (event) => {
    const { cookbookId } = await readBody<{ cookbookId: number | null }>(event)
    try {
        return await apiClient('/cookbooks/favorite', { method: 'POST', body: { cookbook_id: cookbookId ?? null } as any }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
