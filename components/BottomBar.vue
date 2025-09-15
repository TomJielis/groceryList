<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 md:hidden">
    <div class="flex justify-around items-center h-16 text-sm text-gray-600">
      <div v-if="authStore.user" class="flex flex-1">
        <nuxt-link to="/" class="flex flex-1 flex-col items-center justify-center">
          <span class="text-xl">🏠</span>
          <span>Home</span>
        </nuxt-link>
      </div>
      <div v-if="!authStore.user" class="flex flex-1">
        <nuxt-link to="/auth/login" replace class="flex flex-1 flex-col items-center justify-center">
          <span class="text-xl">🔐</span>
          <span>Login</span>
        </nuxt-link>
        <nuxt-link to="/auth/register" replace class="flex flex-1 flex-col items-center justify-center">
          <span class="text-xl">📝</span>
          <span>Register</span>
        </nuxt-link>
      </div>
      <button
          v-else
          @click="logoutUser"
          class="flex flex-1 flex-col items-center justify-center"
      >
        <span class="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {useAuthStore} from '~/stores/auth'

const authStore = useAuthStore()

function logoutUser() {
  authStore.clearAuth();
  router.push('/auth/login');
}
</script>
