<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from 'vue-router';
import { useI18nStore } from "~/stores/i18n";
import { computed } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);

function logoutUser() {
  authStore.clearAuth();
  router.push('/auth/login');
}

function setLocale(locale: 'nl'|'en') {
  i18n.setLocale(locale)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-green-500 text-white flex justify-around items-center p-3 shadow-md md:hidden h-20">
    <nuxtLink v-if="authStore.user" to="/" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.lists') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards/" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.cards') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.login') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.register') }}</span>
    </nuxtLink>
    <button v-if="authStore.user" @click="logoutUser" class="text-sm flex-1">{{ t('nav.logout') }}</button>

    <div class="flex-1 flex items-center justify-center space-x-2">
      <button :class="['px-2 py-1 rounded text-sm', i18n.locale==='nl' ? 'bg-green-700' : 'bg-green-600']" @click="setLocale('nl')">NL</button>
      <button :class="['px-2 py-1 rounded text-sm', i18n.locale==='en' ? 'bg-green-700' : 'bg-green-600']" @click="setLocale('en')">EN</button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  z-index: 50;
}

nav a, nav button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
