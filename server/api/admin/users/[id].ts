import { getCookie, getRouterParam } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const id = getRouterParam(event, 'id')

    try {
        const response = await apiClient(`/admin/users/${id}`, {
            method: 'GET',
        }, token)
        return response
    } catch (error) {
        throw new Error(`Failed to fetch admin user detail: ${error}`)
    }
})
