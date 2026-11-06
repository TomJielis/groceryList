import { getCookie, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError, idParam } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'

// A new photo, as a data URL ("data:image/jpeg;base64,…") like the cards send
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const { image } = await readBody<{ image: string }>(event)
    if (!image) {
        throw createError({ statusCode: 400, statusMessage: 'Missing image' })
    }
    try {
        const response = await apiClient<{ image_url: string; thumb_url: string }>(`/recipes/${id}/image`, { method: 'POST', body: { image } as any }, getCookie(event, 'token'))
        return { data: withSiteImages(response.data) }
    } catch (error: any) {
        throw apiError(error)
    }
})
