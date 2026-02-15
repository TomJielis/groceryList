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
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-16 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <span class="text-4xl">🔑</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ i18n.t('auth.resetPasswordTitle') }}</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ i18n.t('auth.resetPasswordSubtitle') }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!mailSent">
            <form @submit.prevent="handleResetPassword" class="space-y-4">
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

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95 mt-6"
              >
                {{ i18n.t('auth.sendBtn') }}
              </button>
            </form>

            <!-- Back to Login Link -->
            <div class="mt-6 text-center">
              <NuxtLink
                to="/auth/login"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                ← {{ i18n.t('auth.backToLogin') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {{ i18n.t('auth.checkEmailTitle') }}
              </h2>
              <p class="text-slate-500 dark:text-slate-400 text-sm">
                {{ i18n.t('auth.checkEmailBody') }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
