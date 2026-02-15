<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const route = useRoute();

const languageDropdownOpen = ref(false);

function setLocale(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
  languageDropdownOpen.value = false;
}

function isActiveTab(path: string) {
  if (path === '/') {
    // For home/lists page, match exactly '/' or '/list/*' routes
    return route.path === '/' || route.path.startsWith('/list/');
  }
  return route.path.startsWith(path);
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.language-dropdown')) {
    languageDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-16 shadow-xl border-b border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex items-center h-full w-full">
        <nuxt-link to="/" class="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex-shrink-0 hover:scale-105 transition-transform duration-200">
          {{ t('nav.brand') }}
        </nuxt-link>
        <div class="hidden md:flex items-center space-x-1.5 ml-auto">
          <nuxt-link
            to="/information"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActiveTab('/information')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            {{ t('nav.info') }}
          </nuxt-link>

          <nuxt-link
            v-if="authStore.user"
            to="/"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActiveTab('/')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            {{ t('nav.lists') }}
          </nuxt-link>

          <nuxt-link
            v-if="authStore.user"
            to="/cards"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActiveTab('/cards')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            {{ t('nav.cards') }}
          </nuxt-link>

          <nuxt-link
            v-if="!authStore.user"
            to="/auth/login"
            replace
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActiveTab('/auth/login')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            {{ t('nav.login') }}
          </nuxt-link>

          <!-- Primary CTA Button - only one with full gradient -->
          <nuxt-link
            v-if="!authStore.user"
            to="/auth/register"
            replace
            class="ml-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {{ t('nav.register') }}
          </nuxt-link>

          <nuxt-link
            v-if="authStore.user"
            to="/profile"
            class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="isActiveTab('/profile')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            {{ t('nav.profile') }}
          </nuxt-link>

          <div class="relative language-dropdown ml-1">
            <button
              @click="languageDropdownOpen = !languageDropdownOpen"
              class="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-1.5"
            >
              <span class="text-base">🌐</span>
              <span>{{ i18n.locale.toUpperCase() }}</span>
            </button>
            <div
              v-if="languageDropdownOpen"
              class="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-2xl shadow-xl py-2 border border-slate-200 dark:border-slate-700"
            >
              <a
                @click.prevent="setLocale('nl')"
                href="#"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl mx-1 transition-all duration-200"
              >
                <span class="text-lg">🇳🇱</span>
                <span>Nederlands</span>
              </a>
              <a
                @click.prevent="setLocale('en')"
                href="#"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl mx-1 transition-all duration-200"
              >
                <span class="text-lg">🇺🇸</span>
                <span>English</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
