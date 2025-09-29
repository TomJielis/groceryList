<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useRouter} from 'vue-router';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

function logoutUser() {
  authStore.clearAuth();
  router.push('/auth/login');
}
</script>

<template>
  <nav class="bg-green-500 text-white p-1">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">
        <nuxtLink to="/">{{ t('nav.title') }}</nuxtLink>
      </h1>
      <div class="flex items-center space-x-4">
        <ul class="flex space-x-4">
          <nuxtLink v-if="authStore.user" to="/cards/" replace class="hover:underline">{{ t('nav.cards') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/login" replace class="hover:underline">{{ t('nav.login') }}</nuxtLink>
          <nuxtLink v-if="!authStore.user" to="/auth/register" replace class="hover:underline">{{ t('nav.register') }}</nuxtLink>
          <nuxtLink v-if="authStore.user" @click="logoutUser" class="hover:underline">{{ t('nav.logout') }}</nuxtLink>
        </ul>
        <LanguageSwitcher />
      </div>
    </div>
  </nav>
</template>
