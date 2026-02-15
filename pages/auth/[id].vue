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
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-16 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            :class="hasError ? 'bg-red-50 dark:bg-red-900/20' : verified ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'"
          >
            <span v-if="!hasError && !verified" class="text-4xl">✉️</span>
            <svg v-else-if="verified" class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ title }}</h1>
        </div>

        <!-- Content -->
        <div class="p-6 text-center space-y-6">
          <!-- Loading Spinner -->
          <div v-if="!hasError && !verified" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
          </div>

          <!-- Body Text -->
          <p class="text-slate-600 dark:text-slate-400">
            {{ body }}
          </p>

          <!-- Error Message -->
          <div v-if="hasError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ errorText }}
            </p>
          </div>

          <!-- Button -->
          <NuxtLink
            to="/auth/login"
            class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95"
          >
            {{ i18n.t('auth.goToLogin') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
