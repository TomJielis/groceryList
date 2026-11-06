import { getCookie, getQuery, setResponseHeaders } from 'h3'
import { idParam } from '~/server/api/utils/apiError'

// The recipe's photo (or with ?size=thumb its small copy), fetched from the API with the login token: the browser
// can't send that to the API itself (see server/api/utils/recipeImages.ts). Not through apiClient, which reads JSON.
export default defineEventHandler(async (event) => {
    const id = idParam(getRouterParam(event, 'id'))
    const config = useRuntimeConfig()
    const thumb = getQuery(event).size === 'thumb' ? '?size=thumb' : ''
    const token = getCookie(event, 'token')

    const response = await fetch(`${config.api.url}${config.api.basePath}/recipes/${id}/image${thumb}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
    if (!response.ok) {
        throw createError({ statusCode: response.status })
    }

    // The address changes with every new photo (?v=…), so the browser may keep it for a week, like the app does
    setResponseHeaders(event, {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'private, max-age=604800',
    })
    return Buffer.from(await response.arrayBuffer())
})
