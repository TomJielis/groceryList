import { getCookie } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'
import type { TRecipeSummary } from '~/types/TRecipe'

// The recipes of all the user's cookbooks (summaries: no steps, only the ingredient names)
export default defineEventHandler(async (event) => {
    try {
        const response = await apiClient<TRecipeSummary[]>('/recipes/index', { method: 'GET' }, getCookie(event, 'token'))
        return { data: response.data.map(withSiteImages) }
    } catch (error: any) {
        throw apiError(error)
    }
})
