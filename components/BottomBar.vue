<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

function logoutUser() {
  authStore.clearAuth();
  router.push('/auth/login');
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-green-500 text-white flex justify-around items-center p-3 shadow-md md:hidden">
    <nuxtLink to="/" class="text-center">
      <div class="text-sm">Lijsten</div>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards/" class="text-center">
      <div class="text-sm">Kaarten</div>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="text-center">
      <div class="text-sm">Login</div>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="text-center">
      <div class="text-sm">Registreren</div>
    </nuxtLink>
    <button v-if="authStore.user" @click="logoutUser" class="text-sm">Uitloggen</button>
  </nav>
</template>

<style scoped>
nav {
  z-index: 50;
}
</style>
