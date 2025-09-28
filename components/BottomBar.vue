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
  <nav class="fixed bottom-0 left-0 right-0 bg-green-500 text-white flex justify-around items-center p-3 shadow-md md:hidden h-20">
    <nuxtLink to="/" class="text-center flex-1">
      <span class="text-sm">Lijsten</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards/" class="text-center flex-1">
      <span class="text-sm">Kaarten</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="text-center flex-1">
      <span class="text-sm">Login</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="text-center flex-1">
      <span class="text-sm">Registreren</span>
    </nuxtLink>
    <button v-if="authStore.user" @click="logoutUser" class="text-sm flex-1">Uitloggen</button>
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
