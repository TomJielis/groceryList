import {defineNuxtConfig} from 'nuxt/config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtConfig({
    app: {
        head: {
            meta: [
                // Algemene theme kleur
                {name: 'theme-color', content: '#0b1220'},

                // iOS specifieke instellingen
                {name: 'apple-mobile-web-app-capable', content: 'yes'},
                // Probeer "default" in plaats van "black-translucent"
                {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
                {name: 'apple-mobile-web-app-title', content: 'GroceryList'},
            ],
            link: [
                {rel: 'manifest', href: '/manifest.json'},
                {rel: 'apple-touch-icon', href: '/icons/app-icon-3.png'}
            ]
        }
    },
    modules: ['@pinia/nuxt'],
    css: ['@/assets/css/tailwind.css', '@/assets/css/main.css'],
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
    },
    nitro: {
        serverDir: 'server/nuxt-api',
    },
})