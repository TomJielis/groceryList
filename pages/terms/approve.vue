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
    <div class="w-full max-w-md mx-auto">
      <Card class="terms-card">
        <template #content>
          <div class="pb-4 border-b border-[#27272a] mb-6">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-1">Grocery List</p>
            <h2 class="text-lg font-semibold text-[#fafafa]">
              {{ i18n.t('termsApproval.title') }}
            </h2>
            <p class="text-sm text-[#71717a] mt-1">
              {{ i18n.t('termsApproval.body') }}
            </p>
          </div>

          <form @submit.prevent="approveTerms" class="space-y-4">
            <div class="flex items-start gap-3 terms-checkbox-wrapper">
              <Checkbox
                v-model="acceptedTerms"
                binary
                inputId="terms"
                class="terms-checkbox"
              />
              <label
                for="terms"
                class="text-sm text-[#a1a1aa] accept-terms-link cursor-pointer"
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
  font-family: 'DM Sans', system-ui, sans-serif;
  background: transparent;
}

:deep(.terms-card .p-card-body) {
  background: #1e1e21;
  border: 1px solid #27272a;
  border-radius: 0.25rem;
  padding: 1.5rem;
  color: #fafafa;
}

:deep(.terms-card .p-card-content) {
  padding: 0;
}

.terms-checkbox-wrapper {
  padding: 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid #27272a;
  background: transparent;
  transition: border-color 0.15s ease;
}

.terms-checkbox-wrapper:has(.p-checkbox-checked) {
  border-color: #3f3f46;
}

:deep(.terms-checkbox .p-checkbox-box) {
  border-radius: 0.25rem;
  border-color: #3f3f46;
  background: #18181b;
}

:deep(.terms-checkbox .p-checkbox-box.p-highlight) {
  background: #fafafa;
  border-color: #fafafa;
}

:deep(.terms-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon) {
  color: #18181b;
}

.terms-btn :deep(.p-button) {
  border-radius: 0.25rem;
  background: #fafafa;
  color: #18181b;
  border: none;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.15s ease;
}

.terms-btn :deep(.p-button:hover:not(:disabled)) {
  background: #d4d4d8;
}

.terms-btn :deep(.p-button:disabled) {
  background: #27272a;
  color: #52525b;
  opacity: 1;
}

:deep(.accept-terms-link) a {
  color: #a1a1aa;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
  font-weight: 500;
}

:deep(.accept-terms-link) a:hover {
  color: #fafafa;
}
</style>
