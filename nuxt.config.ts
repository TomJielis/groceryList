import { defineNuxtConfig } from 'nuxt/config'

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
    public: {
        termsVersion: '1.0',
        lastUpdatedTerms: '09-11-2025 15:15',
    },
  },
  nitro: {
    serverDir: 'server/nuxt-api',
  },
})