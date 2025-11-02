<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
import Navbar from '~/components/Navbar.vue';
import BottomBar from '~/components/BottomBar.vue';
import { useI18nStore } from "~/stores/i18n";
import { computed } from 'vue'

const i18n = useI18nStore()
const t = computed(() => i18n.t)
useHead(() => ({
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ],
  title: t.value('app.title'),
  meta: [
    {
      name: 'description',
      content: t.value('app.metaDescription')
    }
  ]
}))
</script>
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <div class="h-[100dvh] overflow-hidden bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-inter flex flex-col relative transition-colors">
    <Navbar class="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg"  />

    <NotificationBar />

    <div class="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48 pt-8 md:mb-0">
      <div
          class="overflow-y-auto h-[80dvh] flex-1 md:pb-0 bg-white/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-5 active:shadow-2xl border border-border-light"
      >
        <nuxt-page />
      </div>
    </div>

    <BottomBar class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 shadow-xl border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg" />
  </div>
</template>

<style scoped>
html,
body {
  overflow-x: hidden;
  height: 100%;
  background-color: #0f172a;
}
</style>
