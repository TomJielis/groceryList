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
  css: ['@/assets/css/tailwind.css'],
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