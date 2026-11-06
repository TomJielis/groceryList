import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'
import type { TRecipe, TRecipeInput } from '~/types/TRecipe'

// Saves the whole recipe again (the API always gets all of it)
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const body = await readBody<TRecipeInput>(event)
    try {
        const response = await apiClient<TRecipe>(`/recipes/${id}/update`, { method: 'POST', body: body as any }, getCookie(event, 'token'))
        return { data: withSiteImages(response.data) }
    } catch (error: any) {
        throw apiError(error)
    }
})
