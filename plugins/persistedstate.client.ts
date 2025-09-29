import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia || createPinia()
  pinia.use(piniaPluginPersistedstate)
  if (!nuxtApp.$pinia) {
    nuxtApp.vueApp.use(pinia)
    // @ts-ignore
    nuxtApp.$pinia = pinia
  }
})
