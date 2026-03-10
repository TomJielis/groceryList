import {defineNuxtConfig} from 'nuxt/config'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
    app: {
        head: {
            link: [
                {
                    rel: 'manifest',
                    href: '/manifest.json'
                } as any
            ]
        }
    },
    // Exclude Socket.io paths from Nuxt router
    routeRules: {
        '/socket.io/**': {ssr: false},
    },
    modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
    css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', 'primeicons/primeicons.css'],
    primevue: {
        options: {
            ripple: true,
            theme: {
                preset: Aura
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