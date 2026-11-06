// The API's photo addresses (https://<api>/api/recipes/12/image?v=…) need the login token, which a browser doesn't send
// to the API. This site serves the same path itself (server/api/recipes/[id]/image.get.ts) and adds the token, so the
// pages get the path on this site: /api/recipes/12/image?v=…
type WithImages = { image_url?: string | null; thumb_url?: string | null }

function sitePath(url: string | null | undefined): string | null {
    if (!url) return null
    try {
        const parsed = new URL(url)
        return parsed.pathname + parsed.search
    } catch {
        return null
    }
}

export function withSiteImages<T extends WithImages>(recipe: T): T {
    return { ...recipe, image_url: sitePath(recipe.image_url), thumb_url: sitePath(recipe.thumb_url) }
}
