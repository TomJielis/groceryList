<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar />
    <NotificationBar />
    <nuxtPage />
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