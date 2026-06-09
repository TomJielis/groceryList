import { getCookie, getQuery } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const query = getQuery(event)

    const params = new URLSearchParams()
    if (query.status) params.append('status', query.status as string)
    if (query.type) params.append('type', query.type as string)
    if (query.date_from) params.append('date_from', query.date_from as string)
    if (query.date_to) params.append('date_to', query.date_to as string)
    if (query.per_page) params.append('per_page', query.per_page as string)
    if (query.limit) params.append('limit', query.limit as string)

    const url = `/admin/emails${params.toString() ? `?${params.toString()}` : ''}`

    try {
        const response = await apiClient(url, {
            method: 'GET',
        }, token)
        return response
    } catch (error) {
        throw new Error(`Failed to fetch admin emails: ${error}`)
    }
})
