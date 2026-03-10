<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "~/composables/useAuth";
import { useI18nStore } from '~/stores/i18n';

import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

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
  <div class="auth-shell px-4 py-6 flex items-start justify-center">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center">
      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
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
            <h2 class="text-2xl font-semibold">
              {{ title }}
            </h2>
          </div>

          <div class="text-center space-y-6">
            <div v-if="!hasError && !verified" class="flex justify-center py-4">
              <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
              />
            </div>

            <p class="text-slate-300">
              {{ body }}
            </p>

            <div v-if="hasError" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p class="text-sm text-red-300">
                {{ errorText }}
              </p>
            </div>

            <div class="pt-4 border-t border-white/10">
              <NuxtLink to="/auth/login">
                <Button
                  icon="pi pi-sign-in"
                  :label="i18n.t('auth.goToLogin')"
                  class="auth-btn"
                />
              </NuxtLink>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: transparent;
}

:deep(.auth-card .p-card-body) {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 1.75rem;
  padding: 2rem;
  color: #f8fafc;
}

:deep(.auth-card .p-card-content) {
  padding: 0;
}

.auth-btn :deep(.p-button) {
  border-radius: 999px;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  color: #0f172a;
  border: none;
  font-weight: 600;
}

:deep(.p-progress-spinner-circle) {
  stroke: #60a5fa;
}
</style>
