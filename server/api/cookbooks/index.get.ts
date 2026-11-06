import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'
import type { TCookbook } from '~/types/TCookbook'

// The user's cookbooks (own first, then the ones shared with them), with who is in them and how many recipes
export default defineEventHandler(async (event) => {
    try {
        return await apiClient<TCookbook[]>('/cookbooks/index', { method: 'GET' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
