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
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar class="hidden md:block fixed top-0 left-0 right-0 z-50 h-12" />
    <NotificationBar class="mt-12" />

    <div class="flex-1 pt-0 md:pt-12 pb-16 md:pb-0">
      <nuxtPage />
    </div>

    <BottomBar class="md:hidden fixed bottom-0 left-0 right-0 z-50" />
  </div>
</template>

<style>
html, body {
  touch-action: manipulation;
}
</style>
