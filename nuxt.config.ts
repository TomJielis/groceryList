import {defineNuxtConfig} from 'nuxt/config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtConfig({
    app: {
        head: {
            title: 'GroceryList – Maak en deel je boodschappenlijsten makkelijk',
            meta: [
                {
                    name: 'description',
                    content: 'GroceryList is de makkelijke app om boodschappenlijsten te maken, delen en bijhouden.'
                },
                {property: 'og:title', content: 'GroceryList'},
                {property: 'og:description', content: 'Maak en deel boodschappenlijsten met vrienden of familie.'},
                {property: 'og:type', content: 'website'},
                {property: 'og:url', content: 'https://tomjielis.com'}
            ],
            link: [
                {
                    rel: 'manifest',
                    href: '/manifest.json?v=1.0.5'
                } as any
            ],
        }
    },
    modules: ['@pinia/nuxt'],
    sitemap: {
        hostname: 'https://tomjielis.com',
    },
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