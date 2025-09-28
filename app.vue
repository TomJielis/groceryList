<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
import Navbar from '~/components/Navbar.vue';
import BottomBar from '~/components/BottomBar.vue';

useHead({
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ],
  title: 'Boodschappenlijst',
  meta: [
    {
      name: 'description',
      content: 'Log in om je persoonlijke boodschappenlijstjes te beheren. Gratis en eenvoudig in gebruik.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar class="hidden md:block fixed top-0 left-0 right-0 z-50 h-12" />
    <NotificationBar class="mt-12" />

    <div class="flex-1 pt-0 md:pt-12 pb-16 md:pb-0">
      <nuxtPage />
    </div>

    <BottomBar class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16" />
  </div>
</template>

<style>
html, body {
  touch-action: manipulation;
}
</style>
