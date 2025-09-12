<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';
import {useNotification} from "~/composables/useNotification";

const {showNotification} = useNotification();
const { login } = useAuth();
const authStore = useAuthStore();
const router = useRouter();



const userData = ref({
  email: '',
  password: ''
});

function handleLogin() {
  login(userData.value)
    .then((data) => {
      authStore.setUser(data.user);
      authStore.setToken(data.token);

      router.push('/');
    })
    .catch((error) => {
      showNotification(error);
    });
}
</script>


<template>
  <div class="flex items-center justify-center px-4 h-[90vh]">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">🛒 Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              type="email"
              id="email"
              v-model="userData.email"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
              placeholder="you@example.com"
              required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
              type="password"
              id="password"
              v-model="userData.password"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
              placeholder="••••••••"
              required
          />
        </div>
        <button
            type="submit"
            class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-6">
        Forgot your password?
        <a href="/auth/password/reset" class="text-green-500 hover:underline font-medium">Reset password</a>
      </p>
      <p class="text-sm text-center text-gray-600 mt-6">
        Don't have an account?
        <a href="/auth/register" class="text-green-500 hover:underline font-medium">Register</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>