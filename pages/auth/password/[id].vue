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
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <span class="text-4xl">🔐</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ i18n.t('auth.newPasswordTitle') || 'Nieuw wachtwoord' }}</h1>
          <p class="text-blue-100 text-sm">{{ i18n.t('auth.newPasswordSubtitle') || 'Kies een nieuw wachtwoord voor je account' }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!passwordUpdated">
            <form @submit.prevent="triggerNewPassword" class="space-y-4">
              <input type="hidden" v-model="userData.token" />

              <!-- Email Input -->
              <div>
                <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.email') || 'Email' }}
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="userData.email"
                  :placeholder="i18n.t('auth.emailPlaceholder') || 'je@email.nl'"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Password Input -->
              <div>
                <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.newPassword') || 'Nieuw wachtwoord' }}
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="userData.password"
                  :placeholder="i18n.t('auth.passwordPlaceholder') || '••••••••'"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Repeat Password Input -->
              <div>
                <label for="repeatPassword" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.repeatPassword') || 'Herhaal wachtwoord' }}
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  v-model="userData.repeatPassword"
                  :placeholder="i18n.t('auth.repeatPasswordPlaceholder') || '••••••••'"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ i18n.t('auth.resetPasswordBtn') || 'Wachtwoord wijzigen' }}</span>
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {{ i18n.t('auth.passwordUpdatedTitle') || 'Wachtwoord gewijzigd!' }}
              </h2>
              <p class="text-slate-600 dark:text-slate-400">
                {{ i18n.t('auth.passwordUpdatedBody') || 'Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord.' }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span>{{ i18n.t('auth.goToLogin') || 'Naar inloggen' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
