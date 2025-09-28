<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useRouter} from "vue-router";
import {useNotification} from "~/composables/useNotification";

const {showNotification} = useNotification();
const { register } = useAuth();
const router = useRouter();
const userData = ref({
  name: '',
  email: '',
  password: ''
});

const verifyMailMessage = ref(false);

function handleRegister() {
  register(userData.value)
      .then((data) => {
        verifyMailMessage.value = true;
      })
      .catch((error) => {
        verifyMailMessage.value = false;
        showNotification(error);
      });
}
</script>

<template>
  <div class="h-[90vh] flex items-center justify-center px-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">📝 Registeren</h2>
      <div v-if="!verifyMailMessage">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
            <input
                type="text"
                id="name"
                v-model="userData.name"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                placeholder="Naam"
                required
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                type="email"
                id="email"
                v-model="userData.email"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                placeholder="voorbeeld@gmail.com"
                required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
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
            Registeren
          </button>
        </form>
        <p class="text-sm text-center text-gray-600 mt-6">
          <nuxtLink to="/auth/login" class="text-green-500 hover:underline font-medium"> Heb je al een account?</nuxtLink>
        </p>
      </div>
      <div v-else>
        <div class="flex flex-col items-center space-y-4">
          <h1 class="text-2xl font-bold text-green-600">Activeer je account</h1>
          <p class="text-gray-600">
            Er is een verificatie-e-mail naar je e-mailadres verzonden. Controleer je inbox en klik op de verificatielink om je account te activeren.            <br>
            <br>
            In het geval dat je de e-mail niet ziet, controleer dan je spam- of junkmap          </p>
          <NuxtLink
              to="/auth/login"
              class="mt-4 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
            Ga naar inloggen
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
