// The invite link someone opened before being logged in: after logging in (also after registering and verifying the
// email address first, in the same browser) they go back to it and are added straight away.
const KEY = 'pendingInviteToken'

export function rememberInvite(token: string) {
    if (import.meta.client && token) localStorage.setItem(KEY, token)
}

export function forgetInvite() {
    if (import.meta.client) localStorage.removeItem(KEY)
}

/** Where to go after logging in (or approving the terms): the invite still waiting, else `fallback` */
export function afterLoginPath(fallback = '/'): string {
    if (!import.meta.client) return fallback
    const token = localStorage.getItem(KEY)
    return token ? `/auth/invite/${encodeURIComponent(token)}` : fallback
}
