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
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-16 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <span class="text-4xl">🔐</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ i18n.t('auth.newPasswordTitle') }}</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ i18n.t('auth.newPasswordSubtitle') }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!passwordUpdated">
            <form @submit.prevent="triggerNewPassword" class="space-y-4">
              <input type="hidden" v-model="userData.token" />

              <!-- Email Input -->
              <div>
                <label for="email" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.email') }}
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="userData.email"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Password Input -->
              <div>
                <label for="password" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.newPassword') }}
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="userData.password"
                  :placeholder="i18n.t('auth.passwordPlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Repeat Password Input -->
              <div>
                <label for="repeatPassword" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.repeatPassword') }}
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  v-model="userData.repeatPassword"
                  :placeholder="i18n.t('auth.repeatPasswordPlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95 mt-6"
              >
                {{ i18n.t('auth.resetPasswordBtn') }}
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {{ i18n.t('auth.passwordUpdatedTitle') }}
              </h2>
              <p class="text-slate-500 dark:text-slate-400 text-sm">
                {{ i18n.t('auth.passwordUpdatedBody') }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all"
            >
              {{ i18n.t('auth.goToLogin') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
