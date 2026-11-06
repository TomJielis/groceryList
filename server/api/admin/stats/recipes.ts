import { getCookie, getQuery } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient"
import { apiError } from "~/server/api/utils/apiError"

// Recipes and cookbooks of all users: added in the month, and how many there are by its end
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const month = typeof query.month === 'string' && /^\d{4}-\d{2}$/.test(query.month) ? `?month=${query.month}` : ''
    try {
        return await apiClient(`/admin/stats/recipes${month}`, { method: 'GET' }, getCookie(event, 'token'))
    } catch (error: any) {
        throw apiError(error)
    }
})
