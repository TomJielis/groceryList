import { createReadStream } from 'node:fs'
import { getMethod, sendStream, setResponseHeaders, setResponseStatus } from 'h3'
import { androidApk } from '~/server/api/utils/androidApk'

// The Android app itself. The content type makes a phone offer to install it; the date in the cache check lets a newer
// APK through as soon as it's on the server. HEAD too: some browsers and download managers check the file first.
export default defineEventHandler(async (event) => {
    const method = getMethod(event)
    if (method !== 'GET' && method !== 'HEAD') {
        throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
    }
    const apk = await androidApk()
    if (!apk) {
        throw createError({ statusCode: 404, statusMessage: 'The Android app is not available' })
    }
    setResponseHeaders(event, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="Shoplisto.apk"',
        'Content-Length': String(apk.size),
        'Last-Modified': apk.updatedAt.toUTCString(),
        'Cache-Control': 'no-cache',
    })
    if (method === 'HEAD') {
        // The headers of the download, without the file
        setResponseStatus(event, 200)
        return ''
    }
    return sendStream(event, createReadStream(apk.path))
})
