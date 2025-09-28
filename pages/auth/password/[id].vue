<script setup lang="ts">

import {ref} from "vue";
import { useAuth} from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import {useNotification} from "~/composables/useNotification";


const {showNotification} = useNotification();
const route = useRoute();
const passwordUpdated = ref(false);

const { setNewPassword } = useAuth();
const userData = ref({
  email: '',
  password: '',
  repeatPassword: '',
  token: route.params.id as string
});

function triggerNewPassword()
{
  setNewPassword(userData.value)
      .then(() => {
        passwordUpdated.value = true;
      })
      .catch((error) => {
        showNotification(error);
      });
}

</script>

<template>
  <div class="flex items-center justify-center px-4 h-[90vh]">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <div v-if="!passwordUpdated">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">🛒 Wachtwoord resetten</h2>
        <form @submit.prevent="triggerNewPassword" class="space-y-5">
          <input type="text"
                 id="token"
                 v-model="userData.token"
                 class="hidden"
          />
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
          <div>
            <label for="repeatPassword" class="block text-sm font-medium text-gray-700 mb-1">Herhaal wacthwoord</label>
            <input
                type="password"
                id="repeatPassword"
                v-model="userData.repeatPassword"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                placeholder="••••••••"
                required
            />
          </div>
          <button
              type="submit"
              class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">📝 Je wachtwoord is gereset!</h2>
        <p class="text-sm text-gray-700">
          Je kunt nu inloggen met je nieuwe wachtwoord.
          <nuxtLink to="/auth/login" class="text-green-500 hover:underline font-medium">Klik hier om in te loggen</nuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
