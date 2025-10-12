import { defineNuxtConfig } from 'nuxt/config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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