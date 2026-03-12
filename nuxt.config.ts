import {defineNuxtConfig} from 'nuxt/config'
import BusinessPreset from './assets/theme/business'

export default defineNuxtConfig({
    app: {
        head: {
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
    modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
    css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', '@/assets/css/app-theme.css', 'primeicons/primeicons.css'],
    primevue: {
        options: {
            ripple: true,
            theme: {
                preset: BusinessPreset
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
        public: {
            termsVersion: '1.1',
            lastUpdatedTerms: '10-11-2025 22:35',
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