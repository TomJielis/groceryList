import { getCookie } from 'h3'
import { apiClient } from '../utils/apiClient'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    try {
        const response = await apiClient('/cards/index', {
            method: 'GET',
        }, token)

        // response shape assumed: { success: boolean, data: Card[], message?: string }
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch cards')
        }

        return response // or return response.data if you want just cards
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }
})
