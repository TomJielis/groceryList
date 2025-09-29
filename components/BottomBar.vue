<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from 'vue-router';
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

    <!-- Language switcher in bottom bar -->
    <div class="flex-shrink-0 ml-2">
      <LanguageSwitcher />
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
