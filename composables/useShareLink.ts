import { useI18nStore } from '~/stores/i18n'
import { useNotification } from '~/composables/useNotification'

/**
 * Shares an invite link: the share sheet where there is one (phones, the installed app), otherwise the link goes to the
 * clipboard. Safari only allows either straight after a tap, so make the link before the tap where possible (the pages
 * keep the links they made, so a second tap shares at once).
 */
export function useShareLink() {
    const i18n = useI18nStore()
    const { showSuccess, showNotification } = useNotification()

    async function shareLink(url: string, title: string, text: string): Promise<void> {
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({ title, text, url })
                return
            } catch (error: any) {
                // Closed without sharing: nothing to say
                if (error?.name === 'AbortError') return
                // Otherwise (e.g. not allowed this long after the tap) the clipboard below
            }
        }

        try {
            await navigator.clipboard.writeText(url)
            showSuccess(i18n.t('lists.linkCopied'))
        } catch {
            showNotification(i18n.t('errors.linkCopyFailed'))
        }
    }

    return { shareLink }
}
