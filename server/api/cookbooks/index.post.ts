import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'
import type { TCookbook } from '~/types/TCookbook'

export default defineEventHandler(async (event) => {
    const { name } = await readBody<{ name: string }>(event)
    try {
        return await apiClient<TCookbook>('/cookbooks/store', { method: 'POST', body: { name } as any }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
