import { getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    try {
        const response = await apiClient('/admin/stats/items', {
            method: 'GET',
        }, token)
        return response
    } catch (error) {
        throw new Error(`Failed to fetch admin items stats: ${error}`)
    }
})
