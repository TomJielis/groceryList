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
  <div class="flex flex-col h-screen w-full bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-inter relative transition-colors">
    <!-- Navbar -->
    <Navbar class="hidden md:block fixed top-0 left-0 right-0 z-50 h-16 shadow-xl border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg" />
    <NotificationBar />

    <!-- Main content -->
    <main class="flex flex-col items-center justify-center flex-1 overflow-y-auto pt-4 md:pt-20 pb-4 md:pb-8 px-2 md:px-0 h-[calc(100dvh-4rem-4rem)] max-h-[calc(100dvh-4rem-4rem)]">
      <div class="w-full max-w-2xl rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-10 mt-2 md:mt-0 flex flex-col flex-1 min-h-0 overflow-y-auto">
        <nuxtPage />
      </div>
    </main>

    <!-- Floating action button -->
    <button
      class="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-4xl transition md:hidden border-4 border-white dark:border-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800"
      aria-label="Actie"
      @click="$emit('fab-click')"
    >
      <span class="pb-1">+</span>
    </button>

    <!-- BottomBar -->
    <BottomBar class="md:hidden flex-shrink-0 h-16 shadow-xl border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg" />
  </div>
</template>

<style>
html, body {
  touch-action: manipulation;
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #f0f7fa 0%, #e0e7ff 100%);
  height: 100%;
  margin: 0;
  padding: 0;
}
#app, #__nuxt {
  height: 100%;
}
</style>
