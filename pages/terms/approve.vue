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
      <Card>
        <template #content>
          <div class="pb-4 border-b border-surface-200 mb-6">
            <h2 class="text-lg font-semibold">
              {{ i18n.t('termsApproval.title') }}
            </h2>
            <p class="text-sm text-color-secondary mt-1">
              {{ i18n.t('termsApproval.body') }}
            </p>
          </div>

          <form @submit.prevent="approveTerms" class="space-y-4">
            <div class="flex items-start gap-3">
              <Checkbox
                v-model="acceptedTerms"
                binary
                inputId="terms"
              />
              <label
                for="terms"
                class="text-sm text-color-secondary accept-terms-link cursor-pointer"
                v-html="i18n.t('register.acceptTerms')"
              />
            </div>

            <Button
              type="submit"
              severity="primary"
              icon="pi pi-check"
              :label="i18n.t('termsApproval.approveBtn')"
              :disabled="!acceptedTerms"
              class="w-full"
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

:deep(.accept-terms-link) a {
  color: var(--p-text-muted-color);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
  font-weight: 500;
}

:deep(.accept-terms-link) a:hover {
  color: var(--p-text-color);
}
</style>
