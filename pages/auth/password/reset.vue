<script setup lang="ts">
import {ref} from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useNotification} from "~/composables/useNotification";
import {useI18nStore} from '~/stores/i18n';

const i18n = useI18nStore();
const {showNotification} = useNotification();
const {resetPassword} = useAuth();
const mailSent = ref(false);
const userData = ref({
  email: '',
});


function handleResetPassword() {
  resetPassword(userData.value)
      .then(() => {
        mailSent.value = true;
      })
      .catch(() => {
        showNotification(i18n.t('errors.passwordResetFailed'));
      });
}
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 py-4 md:py-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <span class="text-4xl">🔑</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ i18n.t('auth.resetPasswordTitle') || 'Wachtwoord vergeten' }}</h1>
          <p class="text-blue-100 text-sm">{{ i18n.t('auth.resetPasswordSubtitle') || 'Geen probleem, we sturen je een reset link' }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!mailSent">
            <form @submit.prevent="handleResetPassword" class="space-y-4">
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

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>{{ i18n.t('auth.sendBtn') || 'Verstuur reset link' }}</span>
              </button>
            </form>

            <!-- Back to Login Link -->
            <div class="mt-6 text-center">
              <NuxtLink
                to="/auth/login"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span>{{ i18n.t('auth.backToLogin') || 'Terug naar inloggen' }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {{ i18n.t('auth.checkEmailTitle') || 'Controleer je email' }}
              </h2>
              <p class="text-slate-600 dark:text-slate-400">
                {{ i18n.t('auth.checkEmailBody') || 'We hebben een reset link gestuurd naar je email.' }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>{{ i18n.t('auth.backToLogin') || 'Terug naar inloggen' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
