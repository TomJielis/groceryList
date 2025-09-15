<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden pb-[var(--bottom-bar-height)]">
    <div class="hidden md:block">
      <Navbar />
    </div>
    <NotificationBar />
    <nuxtPage />
    <div class="md:hidden">
      <BottomBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
useHead({
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>
<style>
html, body {
  touch-action: manipulation;
}
</style>