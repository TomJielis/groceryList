import { getCookie, getQuery, readBody } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'
import { apiError } from '~/server/api/utils/apiError'
import { withSiteImages } from '~/server/api/utils/recipeImages'

// The week menu routes of the API (/api/week-menus/...), passed on as they are: index, store, {id}/update,
// {id}/delete, {id}/members/{userId}, {id}/entries (+ /{entryId}/update|delete, /added-to-list), {id}/invite-link
export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path') || ''
    // Only the API's own paths: letters, digits, dashes and slashes
    if (!/^[a-z0-9\-/]+$/i.test(path) || path.includes('..')) {
        throw createError({ statusCode: 404 })
    }
    const query = new URLSearchParams(getQuery(event) as Record<string, string>).toString()
    const method = event.method
    const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(event).catch(() => undefined) : undefined
    try {
        const response: any = await apiClient(`/week-menus/${path}${query ? `?${query}` : ''}`, { method, body }, getCookie(event, 'token'))
        // The recipes' photos through this site, like the recipe routes: the API's address needs the login
        const withPhotos = (entry: any) => (entry?.recipe ? { ...entry, recipe: withSiteImages(entry.recipe) } : entry)
        if (Array.isArray(response?.data)) return { ...response, data: response.data.map(withPhotos) }
        if (response?.data?.recipe) return { ...response, data: withPhotos(response.data) }
        return response
    } catch (error: any) {
        throw apiError(error)
    }
})
