<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useRouter} from 'vue-router';
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

function onChangeLocale(e: Event) {
  const target = e.target as HTMLSelectElement
  i18n.setLocale(target.value as any)
}
</script>

<template>
  <nav class="bg-green-500 text-white p-1">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold"><nuxtLink to="/">{{ t('nav.brand') }}</nuxtLink></h1>
      <div class="flex items-center space-x-4">
        <ul class="flex space-x-4">
          <nuxtLink v-if="authStore.user" to="/cards/" replace class="hover:underline">{{ t('nav.cards') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/login" replace class="hover:underline">{{ t('nav.login') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/register" replace class="hover:underline">{{ t('nav.register') }}</nuxtLink>
          <nuxtLink v-if="authStore.user" @click="logoutUser" class="hover:underline">{{ t('nav.logout') }}</nuxtLink>
        </ul>
        <div class="flex items-center space-x-2">
          <label for="lang-select" class="text-sm sr-only">{{ t('nav.language') }}</label>
          <select id="lang-select" class="bg-green-600 text-white text-sm px-2 py-1 rounded" :value="i18n.locale" @change="onChangeLocale">
            <option value="nl">NL</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </div>
  </nav>
</template>
