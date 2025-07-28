<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
const { register } = useAuth();

const userData = ref({
  name: 'Tom',
  email: 'tomjielis@hotmail.com',
  password: 'test1234'
});

function handleRegister() {
  register(userData.value);
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
      <form>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
              type="text"
              id="name"
              v-model="userData.name"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your name"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              type="email"
              v-model="userData.email"
              id="email"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your email"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
              type="password"
              v-model="userData.password"
              id="password"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
          />
        </div>
        <button
            @click="handleRegister"
            type="submit"
            class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-4">
        Already have an account?
        <nuxtLink to="/auth/login" class="text-green-500 hover:underline">Login</nuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>