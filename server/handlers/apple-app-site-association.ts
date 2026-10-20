import { createError, setHeader } from 'h3'

// Served at /.well-known/apple-app-site-association (registered in nuxt.config.ts).
// Lets the iOS app open the links from our emails (verify email, reset password, invite) instead of Safari.
// Only /auth/* is claimed, so the rest of the site keeps opening in the browser.
export default defineEventHandler((event) => {
    const { appleTeamId, iosBundleId } = useRuntimeConfig().appLinks

    // Without a Team ID the file would be invalid; Apple caches what it gets, so serve nothing instead
    if (!appleTeamId) {
        throw createError({ statusCode: 404 })
    }

    const appId = `${appleTeamId}.${iosBundleId}`

    setHeader(event, 'Content-Type', 'application/json')
    return {
        applinks: {
            apps: [],
            details: [
                {
                    // iOS 13+ format
                    appIDs: [appId],
                    components: [{ '/': '/auth/*' }],
                    // Pre-iOS 13 format
                    appID: appId,
                    paths: ['/auth/*'],
                },
            ],
        },
    }
})
