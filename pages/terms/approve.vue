<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '~/stores/i18n'
import { useRouter } from 'vue-router'
import {useAuth} from "~/composables/useAuth";
import { useAuthStore} from "~/stores/auth";

import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

definePageMeta({
  middleware: ['auth'],
})

const authStore = useAuthStore();
const auth = useAuth();
const i18n = useI18nStore()
const router = useRouter()
const acceptedTerms = ref(false)

onMounted(async () => {
  try {
    const user = await auth.me()
    if (user) {
      authStore.setUser(user)
    } else {
      authStore.clearAuth()
      router.push('/auth/login')
    }
  } catch (err: any) {
    authStore.clearAuth()
    router.push('/auth/login')
  }
})

const approveTerms = async () => {
  const user = await auth.approveTerms();
  authStore.setUser(user)
  router.push('/');
};
</script>

<template>
  <div class="terms-shell px-4 py-6 flex items-start justify-center">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center">
      <Card class="terms-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">📋</div>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('termsApproval.title') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ i18n.t('termsApproval.body') }}
            </p>
          </div>

          <form @submit.prevent="approveTerms" class="space-y-6">
            <div class="flex items-start gap-3 terms-checkbox-wrapper">
              <Checkbox
                v-model="acceptedTerms"
                binary
                inputId="terms"
                class="terms-checkbox"
              />
              <label
                for="terms"
                class="text-sm text-slate-200 accept-terms-link cursor-pointer"
                v-html="i18n.t('register.acceptTerms')"
              />
            </div>

            <Button
              type="submit"
              icon="pi pi-check"
              :label="i18n.t('termsApproval.approveBtn')"
              :disabled="!acceptedTerms"
              class="w-full terms-btn"
            />
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.terms-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: transparent;
}

:deep(.terms-card .p-card-body) {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 1.75rem;
  padding: 2rem;
  color: #f8fafc;
}

:deep(.terms-card .p-card-content) {
  padding: 0;
}

.terms-checkbox-wrapper {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(15, 23, 42, 0.5);
  transition: all 0.2s ease;
}

.terms-checkbox-wrapper:has(.p-checkbox-checked) {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

:deep(.terms-checkbox .p-checkbox-box) {
  border-radius: 0.5rem;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(15, 23, 42, 0.8);
}

:deep(.terms-checkbox .p-checkbox-box.p-highlight) {
  background: linear-gradient(90deg, #34d399, #10b981);
  border-color: #34d399;
}

.terms-btn :deep(.p-button) {
  border-radius: 999px;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  color: #0f172a;
  border: none;
  font-weight: 600;
  width: 100%;
}

.terms-btn :deep(.p-button:disabled) {
  background: rgba(100, 116, 139, 0.5);
  color: rgba(248, 250, 252, 0.5);
}

:deep(.accept-terms-link) a {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  font-weight: 600;
}

:deep(.accept-terms-link) a:hover {
  color: #93c5fd;
}
</style>
