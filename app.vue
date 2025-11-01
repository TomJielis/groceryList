<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
import Navbar from '~/components/Navbar.vue';
import BottomBar from '~/components/BottomBar.vue';
import { useI18nStore } from "~/stores/i18n";
import { computed, watch } from 'vue'

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
  <div class="flex flex-col overflow-x-hidden bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-inter flex flex-col relative transition-colors">
    <Navbar class="hidden md:block fixed top-0 left-0 right-0 z-50 h-12 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg"  />

    <NotificationBar />

    <div
        class="flex-1 overflow-y-auto md:pt-12 pb-16 md:pb-0 bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-slate-100 dark:border-slate-700"
        style="height: calc(100vh - var(--navbar-height, 0px) - var(--bottombar-height, 0px));"
    >
      <nuxt-page />
    </div>

    <BottomBar class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 shadow-xl border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg" />
  </div>
</template>

<style scoped>
html,
body {
  overflow-x: hidden;
  height: 100%;
}
</style>
