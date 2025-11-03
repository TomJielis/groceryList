<script setup lang="ts">

import {ref} from "vue";
import { useAuth} from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();
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
      .catch(() => {
        showNotification(i18n.t('errors.unexpectedError'));
      });
}

</script>

<template>
  <div class="flex items-center justify-center px-4 ">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <div v-if="!passwordUpdated">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">
          🛒 {{ i18n.t('auth.resetPasswordTitle') }}
        </h2>
        <form @submit.prevent="triggerNewPassword" class="space-y-5">
          <input type="text"
                 id="token"
                 v-model="userData.token"
                 class="hidden"
          />
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.email') }}</label>
            <input
                type="email"
                id="email"
                v-model="userData.email"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.password') }}</label>
            <input
                type="password"
                id="password"
                v-model="userData.password"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.password')"
                required
            />
          </div>
          <div>
            <label for="repeatPassword" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.repeatPassword') }}</label>
            <input
                type="password"
                id="repeatPassword"
                v-model="userData.repeatPassword"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.repeatPassword')"
                required
            />
          </div>
          <button type="submit" class="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold">
            {{ i18n.t('auth.resetPasswordBtn') }}
          </button>
        </form>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {{ i18n.t('auth.passwordUpdatedTitle') }}
        </h2>
        <p class="text-sm text-gray-700">
          {{ i18n.t('auth.passwordUpdatedBody') }}
        </p>
      </div>
    </div>
  </div>
</template>
