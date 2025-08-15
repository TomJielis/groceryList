import { createPinia } from 'pinia';
export default defineNuxtPlugin((nuxtApp) => {
  // Register Pinia store
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
})