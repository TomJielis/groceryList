<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, ref, onMounted } from 'vue';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);

const languageDropdownOpen = ref(false);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

function setLocale(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
  languageDropdownOpen.value = false;
}
</script>
<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-16 shadow-xl border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex items-center h-full w-full">
        <nuxt-link class="font-bold text-xl text-primary-dark dark:text-accent-light flex-shrink-0">
          {{ t('nav.brand') }}
        </nuxt-link>
        <div class="hidden md:flex items-center space-x-4 ml-auto">
          <nuxt-link to="/" class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.info') }}</nuxt-link>
          <nuxt-link v-if="authStore.user" to="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.lists') }}</nuxt-link>
          <nuxt-link v-if="authStore.user" to="/cards" class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.cards') }}</nuxt-link>
          <nuxt-link v-if="!authStore.user" to="/auth/login" replace class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.login') }}</nuxt-link>
          <nuxt-link v-if="!authStore.user" to="/auth/register" replace class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.register') }}</nuxt-link>
          <nuxt-link v-if="authStore.user" to="/profile" class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{{ t('nav.profile') }}</nuxt-link>
          <div class="relative">
            <button @click="languageDropdownOpen = !languageDropdownOpen" class="px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
              <span>🌐</span>
              <span>{{ i18n.locale.toUpperCase() }}</span>
            </button>
            <div v-if="languageDropdownOpen" @click.away="languageDropdownOpen = false" class="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700">
              <a @click.prevent="setLocale('nl')" href="#" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">🇳🇱 Nederlands</a>
              <a @click.prevent="setLocale('en')" href="#" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">🇺🇸 English</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
