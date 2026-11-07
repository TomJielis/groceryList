<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'
import { useIosDownload } from '~/composables/useIosDownload'

// "Download the app" at the top of the information page: the iPhone app (TestFlight while in beta, then the App Store,
// see useIosDownload) and the Android app (the APK on /android). On a phone its own platform comes first; the website
// itself stays an option for the browser.
const i18n = useI18nStore()
const ios = useIosDownload()

// Only known in the browser (the server renders both in the default order)
const platform = ref<'ios' | 'android' | 'other'>('other')
onMounted(() => {
  const agent = navigator.userAgent
  // iPads ask for the desktop site and say "Macintosh", but have a touch screen
  if (/iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1)) platform.value = 'ios'
  else if (/Android/.test(agent)) platform.value = 'android'
})

const androidFirst = computed(() => platform.value === 'android')
</script>

<template>
  <section class="app-download rounded p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6" data-testid="app-download">
    <!-- The app's own icon (GroceryListExpo/assets/images/ios-icon-light.png) -->
    <img src="/icons/shoplisto-app-icon.png" alt="" class="w-20 h-20 rounded-2xl shadow-sm flex-shrink-0" />
    <div class="flex-1 space-y-2">
      <h2 class="text-[1.4rem] font-light tracking-tight">{{ i18n.t('info.downloadTitle') }}</h2>
      <p class="text-sm text-color-secondary leading-relaxed">{{ i18n.t('info.downloadText') }}</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3" :class="{ 'sm:flex-row-reverse flex-col-reverse': androidFirst }">
      <a v-if="ios.url" :href="ios.url" data-testid="download-ios">
        <Button
          icon="pi pi-apple"
          :label="ios.label.value"
          :severity="platform === 'android' ? 'secondary' : 'primary'"
          :outlined="platform === 'android'"
          class="w-full"
        />
      </a>
      <NuxtLink to="/android" data-testid="download-android">
        <Button
          icon="pi pi-android"
          :label="i18n.t('android.infoLink')"
          :severity="platform === 'android' ? 'primary' : 'secondary'"
          :outlined="platform !== 'android'"
          class="w-full"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.app-download {
  background: var(--p-surface-0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}
</style>
