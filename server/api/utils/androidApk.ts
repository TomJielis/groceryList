import { stat } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'

// The Android app on this server (runtimeConfig.androidApk.path, NUXT_ANDROID_APK_PATH), or null when there is none
export async function androidApk(): Promise<{ path: string; size: number; updatedAt: Date } | null> {
    const configured = useRuntimeConfig().androidApk.path
    if (!configured) return null
    // downloads/Shoplisto.apk by default, from the project folder. `nuxt start` (npm start, pm2) runs the server from
    // .output inside it, `nuxt dev` from the project folder itself
    const cwd = process.cwd()
    const projectFolder = basename(cwd) === '.output' ? dirname(cwd) : cwd
    const path = resolve(projectFolder, configured)
    try {
        const file = await stat(path)
        return file.isFile() ? { path, size: file.size, updatedAt: file.mtime } : null
    } catch {
        return null
    }
}
