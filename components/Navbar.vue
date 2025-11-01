<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed } from 'vue';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
</script>
<template>
  <nav class="p-1 text-white bg-blue-950">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold"><nuxtLink to="/">{{ t('nav.brand') }}</nuxtLink></h1>
      <div class="flex items-center space-x-4">
        <ul class="flex space-x-4">
          <nuxtLink v-if="authStore.user" to="/cards/" replace class="hover:underline">{{ t('nav.cards') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/login" replace class="hover:underline">{{ t('nav.login') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/register" replace class="hover:underline">{{ t('nav.register') }}</nuxtLink>
          <nuxtLink v-if="authStore.user" to="/profile" class="hover:underline">{{ t('nav.profile') }}</nuxtLink>
        </ul>
      </div>
    </div>
  </nav>
</template>
