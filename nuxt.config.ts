import {defineNuxtConfig} from 'nuxt/config'
import BusinessPreset from './assets/theme/business'

export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            meta: [
                { charset: 'utf-8' },
                { name: 'robots', content: 'index, follow' },
            ],
            link: [
                {
                    rel: 'manifest',
                    href: '/manifest.json'
                } as any,
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } as any,
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap' },
            ]
        }
    },
    router: {
        options: {
            scrollBehaviorType: 'smooth'
        }
    },
    // Exclude Socket.io paths from Nuxt router
    routeRules: {
        '/socket.io/**': {ssr: false},
    },
    serverHandlers: [
        { route: '/.well-known/apple-app-site-association', handler: '~/server/handlers/apple-app-site-association.ts' },
    ],
    modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
    css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', '@/assets/css/app-theme.css', 'primeicons/primeicons.css'],
    primevue: {
        options: {
            ripple: true,
            theme: {
                preset: BusinessPreset,
                options: {
                    darkModeSelector: 'none'
                }
            }
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        api: {
            url: process.env.API_URL || '0.0.0.0:8000',
            basePath: process.env.API_BASE_PATH || '/api',
        },
        // The Android app (APK) offered on /android: downloads/Shoplisto.apk in this repository, so a new APK goes out
        // with a normal release (commit it, ./release.sh). A relative path counts from where the server runs; another
        // place: NUXT_ANDROID_APK_PATH. No file: the page says the Android app isn't available yet
        androidApk: {
            path: 'downloads/Shoplisto.apk',
        },
        // iOS Universal Links, overridden by NUXT_APP_LINKS_APPLE_TEAM_ID / NUXT_APP_LINKS_IOS_BUNDLE_ID
        appLinks: {
            appleTeamId: '',
            iosBundleId: 'com.tomjielis.groceryListExpo',
        },
        public: {
            // The name shown everywhere on the site (titles, logo text, texts with {app}); set NUXT_PUBLIC_APP_NAME in .env
            appName: 'Shoplisto',
            // Where users can reach you (terms, support page); set NUXT_PUBLIC_SUPPORT_EMAIL in .env
            supportEmail: 'tomjielis@gmail.com',
            // The app's App Store page (https://apps.apple.com/app/id<Apple ID from App Store Connect>), for the invite
            // link page's download button and Safari's app banner; NUXT_PUBLIC_APP_STORE_URL overrides it
            appStoreUrl: 'https://apps.apple.com/app/id6824506915',
            // The public TestFlight link (NUXT_PUBLIC_TEST_FLIGHT_URL), used instead of the App Store while the app is in
            // beta (useIosDownload). Without it, once Apple has approved the app, every page links to the App Store
            testFlightUrl: '',
            termsVersion: '1.3',
            lastUpdatedTerms: '01-11-2026',
        },
    },
    nitro: {
        preset: 'node-server',
        errorHandler: '~/server/utils/globalErrorHandler.ts',
    },
    devtools: {
        enabled: false // Zet Nuxt DevTools volledig uit
    },
    compatibilityDate: '2025-12-30',

})