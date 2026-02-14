import { getCookie, getRouterParam, getQuery } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)

    const params = new URLSearchParams()
    if (query.month) {
        params.append('month', query.month as string)
    }

    const url = `/admin/users/${id}${params.toString() ? `?${params.toString()}` : ''}`

    try {
        const response = await apiClient(url, {
            method: 'GET',
        }, token)
        return response
    } catch (error) {
        throw new Error(`Failed to fetch admin user detail: ${error}`)
    }
})
