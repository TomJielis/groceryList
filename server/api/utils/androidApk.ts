import { readFile, stat } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'

// The Android app on this server (runtimeConfig.androidApk.path, NUXT_ANDROID_APK_PATH), or null when there is none
export async function androidApk(): Promise<{ path: string; size: number; updatedAt: Date; build: number | null } | null> {
    const configured = useRuntimeConfig().androidApk.path
    if (!configured) return null
    // downloads/Shoplisto.apk by default, from the project folder. `nuxt start` (npm start, pm2) runs the server from
    // .output inside it, `nuxt dev` from the project folder itself
    const cwd = process.cwd()
    const projectFolder = basename(cwd) === '.output' ? dirname(cwd) : cwd
    const path = resolve(projectFolder, configured)
    try {
        const file = await stat(path)
        return file.isFile() ? { path, size: file.size, updatedAt: file.mtime, build: await apkBuild(path) } : null
    } catch {
        return null
    }
}

// The build number of the APK, from the Shoplisto.json next to it (written when the APK is copied here)
async function apkBuild(apkPath: string): Promise<number | null> {
    try {
        const build = JSON.parse(await readFile(apkPath.replace(/\.apk$/i, '.json'), 'utf8')).build
        return Number.isInteger(build) ? build : null
    } catch {
        return null
    }
}
