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
  <div class="auth-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10 flex items-start justify-center">
    <div class="w-full max-w-md mx-auto flex flex-col gap-6 my-4 md:my-8">
      <!-- Header -->
      <div class="auth-hero text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
          <span class="text-4xl">🔐</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">{{ i18n.t('auth.newPasswordTitle') }}</h1>
        <p class="text-slate-300 text-sm">{{ i18n.t('auth.newPasswordSubtitle') }}</p>
      </div>

      <!-- Form Card -->
      <div class="auth-card">
        <div v-if="!passwordUpdated">
          <form @submit.prevent="triggerNewPassword" class="space-y-4">
            <input type="hidden" v-model="userData.token" />

            <!-- Email Input -->
            <div>
              <label for="email" class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block px-1">
                {{ i18n.t('auth.email') }}
              </label>
              <input
                type="email"
                id="email"
                v-model="userData.email"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                required
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block px-1">
                {{ i18n.t('auth.newPassword') }}
              </label>
              <input
                type="password"
                id="password"
                v-model="userData.password"
                :placeholder="i18n.t('auth.passwordPlaceholder')"
                required
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Repeat Password Input -->
            <div>
              <label for="repeatPassword" class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block px-1">
                {{ i18n.t('auth.repeatPassword') }}
              </label>
              <input
                type="password"
                id="repeatPassword"
                v-model="userData.repeatPassword"
                :placeholder="i18n.t('auth.repeatPasswordPlaceholder')"
                required
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="auth-cta w-full mt-6"
            >
              {{ i18n.t('auth.resetPasswordBtn') }}
            </button>
          </form>
        </div>

        <!-- Success Message -->
        <div v-else class="text-center space-y-6 py-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-4">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white mb-2">
              {{ i18n.t('auth.passwordUpdatedTitle') }}
            </h2>
            <p class="text-slate-300 text-sm">
              {{ i18n.t('auth.passwordUpdatedBody') }}
            </p>
          </div>
          <NuxtLink
            to="/auth/login"
            class="auth-cta inline-block"
          >
            {{ i18n.t('auth.goToLogin') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.auth-hero {
  padding: 2rem;
  border-radius: 1.75rem;
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.auth-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.85));
  border-radius: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.auth-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  background: linear-gradient(120deg, #fbbf24, #f97316);
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.auth-cta:active {
  transform: translateY(2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.25);
}
</style>
