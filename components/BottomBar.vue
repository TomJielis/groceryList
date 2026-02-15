<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, onMounted, ref } from 'vue';
import { useListStore } from '~/stores/lists';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const listStore = useListStore();
const route = useRoute();

const pendingCount = computed(() => listStore.pendingLists.length);

function setLocale(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
}

onMounted(() => {
  if (listStore.pendingLists.length === 0) {
    listStore.fetchPendingLists();
  }
});

function isActiveTab(path: string) {
  if (path === '/') {
    // For home/lists page, match exactly '/' or '/list/*' routes
    return route.path === '/' || route.path.startsWith('/list/');
  }
  return route.path.startsWith(path);
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 flex justify-around items-center px-2 py-2 shadow-2xl md:hidden h-20 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-700">
    <!-- Info Tab -->
    <nuxtLink
      v-if="!authStore.user"
      to="/information"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/information')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/information') ? 'drop-shadow-lg' : ''">ℹ️</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/information') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.info') }}</span>
    </nuxtLink>

    <!-- Lists Tab -->
    <nuxtLink
      v-if="authStore.user"
      to="/"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/') ? 'drop-shadow-lg' : ''">📝</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.lists') }}</span>
    </nuxtLink>

    <!-- Cards Tab -->
    <nuxtLink
      v-if="authStore.user"
      to="/cards"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/cards')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/cards') ? 'drop-shadow-lg' : ''">💳</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/cards') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.cards') }}</span>
    </nuxtLink>

    <!-- Login Tab -->
    <nuxtLink
      v-if="!authStore.user"
      to="/auth/login"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/auth/login')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/auth/login') ? 'drop-shadow-lg' : ''">🚪</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/auth/login') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.login') }}</span>
    </nuxtLink>

    <!-- Register Tab -->
    <nuxtLink
      v-if="!authStore.user"
      to="/auth/register"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/auth/register')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/auth/register') ? 'drop-shadow-lg' : ''">📝</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/auth/register') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.register') }}</span>
    </nuxtLink>

    <!-- Profile Tab -->
    <nuxtLink
      v-if="authStore.user"
      to="/profile"
      class="flex flex-col items-center justify-center text-center flex-1 py-2.5 px-2 rounded-2xl transition-all duration-300 group relative"
      :class="isActiveTab('/profile')
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'"
    >
      <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300" :class="isActiveTab('/profile') ? 'drop-shadow-lg' : ''">👤</span>
      <span class="text-[11px] font-bold tracking-wide" :class="isActiveTab('/profile') ? 'text-white' : 'text-slate-600 dark:text-slate-400'">{{ t('nav.profile') }}</span>
      <span
        v-if="pendingCount > 0"
        class="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] leading-none rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white dark:border-slate-900"
      >
        {{ pendingCount }}
      </span>
    </nuxtLink>

    <!-- Language Selector -->
    <div v-if="!authStore.user" class="flex flex-col items-center justify-center text-center flex-1">
      <button
        @click="setLocale(i18n.locale === 'nl' ? 'en' : 'nl')"
        class="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl transition-all duration-300 group hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 w-full"
      >
        <span class="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">{{ i18n.locale === 'nl' ? '🇳🇱' : '🇬🇧' }}</span>
        <span class="text-[11px] font-bold tracking-wide text-slate-600 dark:text-slate-400">{{ i18n.locale === 'nl' ? 'NL' : 'EN' }}</span>
      </button>
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
