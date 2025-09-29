export default defineNuxtConfig({
  compatibilityDate: '2025-09-29',
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
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'nl'
    },
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
})