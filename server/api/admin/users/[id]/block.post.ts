import { getCookie, getRouterParam, readBody } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    try {
        const response = await apiClient(`/admin/users/${id}/block`, {
            method: 'POST',
            body: JSON.stringify({ blocked: body.blocked }),
        }, token)
        return response
    } catch (error) {
        throw new Error(`Failed to update user block status: ${error}`)
    }
})

