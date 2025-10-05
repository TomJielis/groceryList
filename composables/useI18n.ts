import { useNuxtApp } from '#app'

export function useI18n() {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n || nuxtApp._i18n || nuxtApp.vueApp.config.globalProperties.$i18n
  return i18n
}

