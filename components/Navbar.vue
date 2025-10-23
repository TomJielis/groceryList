<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed } from 'vue';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
</script>
<template>
  <nav class="w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-2xl rounded-b-3xl backdrop-blur-lg transition-colors">
    <div class="max-w-3xl mx-auto flex justify-between items-center h-16 px-6">
      <h1 class="text-2xl font-extrabold tracking-tight text-primary-dark dark:text-accent-light flex items-center gap-3">
        <span class="text-3xl">🛒</span>
        <nuxtLink to="/" class="hover:text-accent transition-colors duration-200">{{ t('nav.brand') }}</nuxtLink>
      </h1>
      <ul class="flex items-center gap-6">
        <li v-if="authStore.user">
          <nuxtLink to="/cards/" replace class="text-primary-dark dark:text-accent-light hover:text-accent dark:hover:text-accent font-medium transition-colors duration-200">{{ t('nav.cards') }}</nuxtLink>
        </li>
        <li v-if="!authStore.user">
          <nuxtLink to="/auth/login" replace class="text-primary-dark dark:text-accent-light hover:text-accent dark:hover:text-accent font-medium transition-colors duration-200">{{ t('nav.login') }}</nuxtLink>
        </li>
        <li v-if="!authStore.user">
          <nuxtLink to="/auth/register" replace class="text-primary-dark dark:text-accent-light hover:text-accent dark:hover:text-accent font-medium transition-colors duration-200">{{ t('nav.register') }}</nuxtLink>
        </li>
        <li v-if="authStore.user">
          <nuxtLink to="/profile" class="text-primary-dark dark:text-accent-light hover:text-accent dark:hover:text-accent font-medium transition-colors duration-200">{{ t('nav.profile') }}</nuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
