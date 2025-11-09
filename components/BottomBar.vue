<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, onMounted } from 'vue';
import { useListStore } from '~/stores/lists';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const listStore = useListStore();

const pendingCount = computed(() => listStore.pendingLists.length);

onMounted(() => {
  // Only fetch if not already loaded (optional, for optimization)
  if (listStore.pendingLists.length === 0) {
    listStore.fetchPendingLists();
  }
});
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 flex justify-around items-center p-3 shadow-md md:hidden h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
    <nuxtLink  v-if="!authStore.user" to="/" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <span class="text-2xl">ℹ️</span>
      <span class="text-xs font-medium">{{ t('nav.info') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/dashboard" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <span class="text-2xl">📝</span>
      <span class="text-xs font-medium">{{ t('nav.lists') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <span class="text-2xl">💳</span>
      <span class="text-xs font-medium">{{ t('nav.cards') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <span class="text-2xl">🚪</span>
      <span class="text-xs font-medium">{{ t('nav.login') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
      <span class="text-2xl">📝</span>
      <span class="text-xs font-medium">{{ t('nav.register') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/profile" class="flex flex-col items-center justify-center text-center flex-1 py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
      <span class="text-2xl">👤</span>
      <span class="text-xs font-medium">{{ t('nav.profile') }}</span>
      <span
        v-if="pendingCount > 0"
        class="absolute top-1 right-5 bg-red-500 text-white text-[10px] leading-none rounded-full px-1.5 py-0.5 font-bold shadow"
      >
        {{ pendingCount }}
      </span>
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
