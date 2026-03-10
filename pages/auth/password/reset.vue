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
  <div class="auth-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10">
    <div class="auth-grid w-full max-w-4xl mx-auto grid gap-6 items-center md:grid-cols-2">
      <div class="auth-hero rounded-3xl border border-white/10 shadow-2xl p-8 text-white space-y-4">
        <div class="text-5xl">🔑</div>
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-slate-300">
            {{ i18n.t('auth.resetPasswordTitle') }}
          </p>
          <h1 class="text-3xl md:text-4xl font-bold leading-tight">
            {{ i18n.t('auth.resetPasswordSubtitle') }}
          </h1>
        </div>
        <p class="text-sm text-slate-200 max-w-sm">
          {{ i18n.t('auth.resetPasswordSubtitle') }}
        </p>
        <div class="bg-white/10 rounded-2xl p-4 border border-white/20 text-sm text-slate-200">
          {{ i18n.t('auth.resetHelper') }}
        </div>
      </div>

      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">📮</div>
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
          <div class="text-center mt-6 text-sm">
            <NuxtLink
                to="/auth/login"
                class="text-emerald-300"
            >
              ← {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>
        <div
            v-else
            class="text-center py-6 text-white space-y-4"
        >
          <div class="text-4xl mb-3">
            📧
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ i18n.t('auth.checkEmailTitle') }}
          </h3>
          <p class="text-sm text-slate-200 mb-6">
            {{ i18n.t('auth.checkEmailBody') }}
          </p>
          <NuxtLink to="/auth/login">
            <Button
                severity="secondary"
                outlined
                class="auth-btn alt"
                :label="i18n.t('auth.backToLogin')"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.auth-hero {
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(30px);
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
  background: linear-gradient(90deg, #34d399, #10b981);
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
