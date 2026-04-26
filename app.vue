<script setup lang="ts">
import NotificationBar from '~/components/NotificationBar.vue';
import Navbar from '~/components/Navbar.vue';
import BottomBar from '~/components/BottomBar.vue';
import {useI18nStore} from "~/stores/i18n";
import {computed, onMounted} from 'vue'

const i18n = useI18nStore()
const t = computed(() => i18n.t)
useHead(() => ({
  link: [
    {rel: 'manifest', href: '/manifest.json'},
    {rel: 'canonical', href: 'https://tomjielis.com'},
  ],
  title: t.value('app.title'),
  meta: [
    {name: 'description', content: t.value('app.metaDescription')},
    {name: 'keywords', content: 'tomjielis, grocerylist, grocery list, shopping list, boodschappenlijst, TomJielis GroceryList'},
    {name: 'author', content: 'TomJielis'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no'},
    {name: 'apple-mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
    // Open Graph
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://tomjielis.com'},
    {property: 'og:title', content: 'TomJielis GroceryList'},
    {property: 'og:description', content: t.value('app.metaDescription')},
    {property: 'og:image', content: 'https://tomjielis.com/icons/app-icon-3.png'},
    {property: 'og:site_name', content: 'TomJielis GroceryList'},
    // Twitter card
    {name: 'twitter:card', content: 'summary'},
    {name: 'twitter:title', content: 'TomJielis GroceryList'},
    {name: 'twitter:description', content: t.value('app.metaDescription')},
    {name: 'twitter:image', content: 'https://tomjielis.com/icons/app-icon-3.png'},
  ]
}))
const pwa = ref(false);

onMounted(() => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('pwa-standalone');
    pwa.value = true;
  } else {
    document.body.classList.remove('pwa-standalone');
  }

  // Initialize language based on user preference or browser language
  i18n.initLocale();
});

</script>
<template>
  <NuxtLayout>
    <div
        :class="['app-shell min-h-screen flex flex-col relative',
        { 'pwa-standalone': pwa }]"
    >
      <Navbar class="fixed top-0 left-0 right-0 z-50"/>

      <NotificationBar/>

      <div class="scrollable-content flex-1 overflow-y-auto pb-16 md:pb-0">
        <NuxtPage />
      </div>

      <BottomBar class="fixed bottom-0 left-0 right-0 z-50"/>
    </div>
  </NuxtLayout>
</template>

<style>
html,
body {
  overflow: hidden;
  height: 100%;
  overscroll-behavior: contain;
  font-family: 'DM Sans', system-ui, sans-serif;
}

#__nuxt,
#app {
  min-height: 100%;
}

.app-shell {
  font-family: 'DM Sans', system-ui, sans-serif;
}

.scrollable-content {
  padding-top: env(safe-area-inset-top, 0);
}

@media (min-width: 768px) {
  .scrollable-content {
    padding-top: 3rem;
  }
}
</style>
