<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
import Navbar from '~/components/Navbar.vue';
import BottomBar from '~/components/BottomBar.vue';
import {useI18nStore} from "~/stores/i18n";
import {computed, onMounted, ref} from 'vue'
const i18n = useI18nStore()
const t = computed(() => i18n.t)

const isDark = ref(false);
const themeColor = computed(() => isDark.value ? '#0f172a' : '#ffffff');

useHead(() => ({
  link: [
    {rel: 'manifest', href: '/manifest.json'}
  ],
  title: t.value('app.title'),
  meta: [
    {
      name: 'description',
      content: t.value('app.metaDescription')
    },
    {name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover'},
    {name: 'apple-mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    {name: 'theme-color', content: themeColor.value},
  ]
}))

const pwa = ref(false);

const updateTheme = () => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = darkMode;

  // Update meta theme-color dynamically
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', darkMode ? '#0f172a' : '#ffffff');
  }
};

onMounted(() => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.documentElement.classList.add('pwa-standalone');
    document.body.classList.add('pwa-standalone');
    pwa.value = true;
  } else {
    document.documentElement.classList.remove('pwa-standalone');
    document.body.classList.remove('pwa-standalone');
  }

  // Initialize theme
  updateTheme();

  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
});

</script>
<template>
  <div
      :class="['min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-inter flex flex-col relative transition-colors',
      { 'pwa-standalone': pwa }]"
  >
    <Navbar
        class="hidden md:block fixed top-0 left-0 right-0 z-50 h-12 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg"/>

    <NotificationBar/>

    <div
        class="scrollable-content flex-1 overflow-y-auto md:pt-12 pb-16 md:pb-0 bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-slate-100 dark:border-slate-700"
    >
      <nuxt-page/>
    </div>

    <BottomBar
        class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 shadow-xl border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg"/>
  </div>
</template>

<style>
/* Global styles for PWA safe area support */
html,
body {
  overflow-x: hidden;
  height: 100%;
  background-color: #ffffff; /* white for light mode */
}

@media (prefers-color-scheme: dark) {
  html,
  body {
    background-color: #0f172a; /* slate-900 for dark mode - middle of gradient */
  }
}

html.pwa-standalone,
body.pwa-standalone {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

<style scoped>
/* Ensure the background extends into safe areas */
.pwa-standalone {
  padding-top: env(safe-area-inset-top);
}
</style>
