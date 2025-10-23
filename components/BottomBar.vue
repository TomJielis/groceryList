<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed } from 'vue';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark text-primary-dark dark:text-accent-light flex justify-around items-center px-2 py-2 shadow-2xl border-t border-border-light dark:border-border-dark rounded-t-3xl md:hidden h-20 backdrop-blur-lg transition-colors">
    <nuxtLink v-if="authStore.user" to="/" class="flex-1 flex flex-col items-center justify-center gap-1 hover:text-accent dark:hover:text-accent transition-colors duration-200">
      <span class="text-2xl">📝</span>
      <span class="text-xs font-semibold">{{ t('nav.lists') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards/" class="flex-1 flex flex-col items-center justify-center gap-1 hover:text-accent dark:hover:text-accent transition-colors duration-200">
      <span class="text-2xl">💳</span>
      <span class="text-xs font-semibold">{{ t('nav.cards') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="flex-1 flex flex-col items-center justify-center gap-1 hover:text-accent dark:hover:text-accent transition-colors duration-200">
      <span class="text-2xl">🔑</span>
      <span class="text-xs font-semibold">{{ t('nav.login') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="flex-1 flex flex-col items-center justify-center gap-1 hover:text-accent dark:hover:text-accent transition-colors duration-200">
      <span class="text-2xl">📝</span>
      <span class="text-xs font-semibold">{{ t('nav.register') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/profile" class="flex-1 flex flex-col items-center justify-center gap-1 hover:text-accent dark:hover:text-accent transition-colors duration-200">
      <span class="text-2xl">👤</span>
      <span class="text-xs font-semibold">{{ t('nav.profile') }}</span>
    </nuxtLink>
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
