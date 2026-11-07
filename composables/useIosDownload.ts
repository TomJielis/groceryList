import { computed } from 'vue'
import { useI18nStore } from '~/stores/i18n'

/**
 * Where iPhone users get the app: the public TestFlight link while the app is in beta (runtimeConfig.public.testFlightUrl,
 * NUXT_PUBLIC_TEST_FLIGHT_URL), otherwise the App Store (appStoreUrl). Once Apple has approved the app, emptying the
 * TestFlight setting switches every page to the App Store.
 */
export function useIosDownload() {
    const { appStoreUrl, testFlightUrl } = useRuntimeConfig().public
    const i18n = useI18nStore()

    const isTestFlight = Boolean(testFlightUrl)
    const url = (testFlightUrl || appStoreUrl || '') as string
    // Safari's Smart App Banner only knows apps in the App Store, so none while in TestFlight
    const appStoreId = isTestFlight ? null : (/id(\d+)/.exec(appStoreUrl || '')?.[1] ?? null)
    // "Get Shoplisto in the App Store" / "Try Shoplisto via TestFlight (beta)"
    const label = computed(() => i18n.t(isTestFlight ? 'ios.testFlight' : 'ios.appStore'))

    return { url, isTestFlight, appStoreId, label }
}
