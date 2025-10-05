import { createI18n } from 'vue-i18n'
import nl from '~/data/i18n/nl.json'
import en from '~/data/i18n/en.json'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'nl',
    fallbackLocale: 'en',
    messages: {
      nl,
      en
    }
  })
  nuxtApp.vueApp.use(i18n)
  nuxtApp.provide('i18n', i18n)
})

