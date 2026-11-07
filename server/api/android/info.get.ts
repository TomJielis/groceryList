import { androidApk } from '~/server/api/utils/androidApk'

// Whether the Android app can be downloaded, and how big and recent it is (for the /android page)
export default defineEventHandler(async () => {
    const apk = await androidApk()
    return {
        data: apk
            ? { available: true, size: apk.size, updated_at: apk.updatedAt.toISOString() }
            : { available: false, size: null, updated_at: null },
    }
})
