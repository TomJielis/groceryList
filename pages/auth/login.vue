<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';

const { login } = useAuth();
const authStore = useAuthStore();
const router = useRouter();

const userData = ref({
  email: 'tomjielis@hotmail.com',
  password: 'test1234'
});

function handleLogin() {
  login(userData.value)
    .then((data) => {
      authStore.setUser(data.user);

      router.push('/');
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              type="email"
              id="email"
              v-model="userData.email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
              type="password"
              id="password"
              v-model="userData.password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
          />
        </div>
        <button
            type="submit"
            class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-4">
        Don't have an account? <a href="/auth/register" class="text-green-500 hover:underline">Register</a>
      </p>
    </div>
  </div>
</template>
<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>