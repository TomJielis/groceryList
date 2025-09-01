<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";
import { useRouter} from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
function logoutUser() {
  authStore.clearAuth();
  router.push('/auth/login');
}

</script>

<template>
  <nav class="bg-green-500 text-white p-1">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold"><nuxtLink to="/">Grocery List</nuxtLink></h1>
      <ul class="flex space-x-4">
        <nuxtLink v-if="authStore.user" to="/list/lists" replace class="hover:underline">Lists</nuxtLink>
        <nuxtLink v-if="!authStore.user" to="/auth/login" replace class="hover:underline">Login</nuxtLink>
        <nuxtLink v-if="!authStore.user" to="/auth/register" replace class="hover:underline">Register</nuxtLink>
        <nuxtLink v-if="authStore.user" @click="logoutUser" class="hover:underline">Logout</nuxtLink>
      </ul>
    </div>
  </nav>
</template>
