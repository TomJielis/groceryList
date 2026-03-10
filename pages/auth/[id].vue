<script setup lang="ts">

import {ref} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "~/composables/useAuth";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();

const form = ref({
  token: '',
});

const hasError = ref(false)
const verified = ref(false)
const errorText = ref('')
const title = ref(i18n.t('auth.verifyEmailTitle'));
const body = ref(i18n.t('auth.verifyingEmail'));

const auth = useAuth();
const route = useRoute();

form.value.token = route.params.id as string;


auth.verifyEmail(form.value.token).then((data:any) => {
  title.value = i18n.t('auth.emailVerifiedTitle');
  body.value = i18n.t('auth.emailVerifiedBody');
  verified.value = true;
}).catch((error) => {
  title.value = i18n.t('auth.emailVerifyFailedTitle');
  body.value = i18n.t('auth.emailVerifyFailedBody');
  hasError.value = true;
  errorText.value = error || i18n.t('auth.unexpectedError');
});

</script>

<template>
  <div class="auth-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10 flex items-start justify-center">
    <div class="w-full max-w-md mx-auto flex flex-col gap-6 my-4 md:my-8">
      <!-- Header -->
      <div class="auth-hero text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          :class="hasError ? 'bg-red-500/20' : verified ? 'bg-green-500/20' : 'bg-white/10'"
        >
          <span v-if="!hasError && !verified" class="text-4xl">✉️</span>
          <svg v-else-if="verified" class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">{{ title }}</h1>
      </div>

      <!-- Content Card -->
      <div class="auth-card text-center space-y-6">
        <!-- Loading Spinner -->
        <div v-if="!hasError && !verified" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-400 border-t-transparent"></div>
        </div>

        <!-- Body Text -->
        <p class="text-slate-300">
          {{ body }}
        </p>

        <!-- Error Message -->
        <div v-if="hasError" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p class="text-sm text-red-300">
            {{ errorText }}
          </p>
        </div>

        <!-- Button -->
        <NuxtLink
          to="/auth/login"
          class="auth-cta inline-block"
        >
          {{ i18n.t('auth.goToLogin') }}
        </NuxtLink>
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
