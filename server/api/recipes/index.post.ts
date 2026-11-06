import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'
import type { TRecipe, TRecipeInput } from '~/types/TRecipe'

// A new recipe; the API checks the fields (RecipeRequest) and answers its messages, which the form shows
export default defineEventHandler(async (event) => {
    const body = await readBody<TRecipeInput>(event)
    try {
        const response = await apiClient<TRecipe>('/recipes/store', { method: 'POST', body: body as any }, getCookie(event, 'token'))
        return { data: withSiteImages(response.data) }
    } catch (error: any) {
        throw apiError(error)
    }
})
