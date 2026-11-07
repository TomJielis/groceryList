import { createError, setHeader } from 'h3'

// Served at /.well-known/assetlinks.json (registered in nuxt.config.ts): Android's version of the
// apple-app-site-association file. Lets the Android app open the links from our emails (verify email, reset password,
// invite) instead of the browser. Android checks that the app installed is signed with one of these keys; the app
// itself only claims /auth/* (app.json, intentFilters), so the rest of the site keeps opening in the browser.
export default defineEventHandler((event) => {
    const { androidPackage, androidSha256Fingerprints } = useRuntimeConfig().appLinks
    const fingerprints = String(androidSha256Fingerprints || '').split(',').map((f) => f.trim()).filter(Boolean)

    // Without a fingerprint the file would be useless; Android caches what it gets, so serve nothing instead
    if (!androidPackage || fingerprints.length === 0) {
        throw createError({ statusCode: 404 })
    }

    setHeader(event, 'Content-Type', 'application/json')
    return [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                package_name: androidPackage,
                sha256_cert_fingerprints: fingerprints,
            },
        },
    ]
})
