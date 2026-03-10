<script setup lang="ts">
import { ref } from 'vue'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

import { useAuth } from '~/composables/useAuth'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'

const i18n = useI18nStore()
const { showNotification } = useNotification()
const { resetPassword } = useAuth()

const mailSent = ref(false)

const userData = ref({
  email: ''
})

async function handleResetPassword() {
  try {
    await resetPassword(userData.value)
    mailSent.value = true
  } catch {
    showNotification(i18n.t('errors.passwordResetFailed'))
  }
}
</script>

<template>
  <div class="auth-shell px-4 py-6">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center">
      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">🔑</div>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('auth.resetPasswordTitle') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ i18n.t('auth.resetPasswordSubtitle') }}
            </p>
          </div>
        <div v-if="!mailSent">
          <form
              @submit.prevent="handleResetPassword"
              class="space-y-4"
          >
            <div>
              <label class="block mb-2 text-sm text-slate-200">
                {{ i18n.t('auth.email') }}
              </label>

              <InputText
                  v-model="userData.email"
                  type="email"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full auth-input"
              />
            </div>
            <Button
                type="submit"
                icon="pi pi-send"
                class="w-full auth-btn"
                :label="i18n.t('auth.sendBtn')"
            />
          </form>
          <div class="text-center mt-8 pt-4 border-t border-white/10 text-sm">
            <NuxtLink
                to="/auth/login"
                class="text-emerald-300 hover:text-emerald-200 transition"
            >
              ← {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>
        <div
            v-else
            class="text-center py-6 text-white"
        >
          <div class="text-4xl mb-4">
            📧
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ i18n.t('auth.checkEmailTitle') }}
          </h3>
          <p class="text-sm text-slate-200 mb-8">
            {{ i18n.t('auth.checkEmailBody') }}
          </p>
          <div class="pt-4 border-t border-white/10">
            <NuxtLink to="/auth/login">
              <Button
                  severity="secondary"
                  outlined
                  class="auth-btn alt"
                  :label="i18n.t('auth.backToLogin')"
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

:deep(.auth-input.p-inputtext) {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
}

:deep(.auth-input.p-inputtext::placeholder) {
  color: #cbd5f5;
}

.auth-btn :deep(.p-button) {
  border-radius: 999px;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  color: #0f172a;
  border: none;
  font-weight: 600;
}

.auth-btn.alt :deep(.p-button) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #f8fafc;
}
</style>
