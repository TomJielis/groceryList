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
<style>
html, body {
  touch-action: manipulation;
}
</style>