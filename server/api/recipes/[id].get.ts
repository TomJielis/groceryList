import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'
import type { TRecipe } from '~/types/TRecipe'

// The whole recipe, as the recipe page shows it
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    try {
        const response = await apiClient<TRecipe>(`/recipes/${id}`, { method: 'GET' }, getCookie(event, 'token'))
        return { data: withSiteImages(response.data) }
    } catch (error: any) {
        throw apiError(error)
    }
})
