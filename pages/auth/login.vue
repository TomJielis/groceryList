<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
const { login } = useAuth();


const userData = ref({
  email: 'tomjielis@hotmail.com',
  password: 'test1234'
});

function handleLogin() {
  login(userData.value)
    .then(() => {
      // Redirect to home or dashboard after successful login
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Login failed:', error);
      // Handle login error (e.g., show a notification)
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
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-4">
        Don't have an account? <a href="/auth/register" class="text-indigo-600 hover:underline">Register</a>
      </p>
    </div>
  </div>
</template>
<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>