<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useAuth } from '~/composables/useAuth'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'

const i18n = useI18nStore()
const { showNotification } = useNotification()
const { resetPassword } = useAuth()
const mailSent = ref(false)
const userData = ref({ email: '' })

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
  <div class="auth-page min-h-full flex items-center justify-center py-16 px-6">

    <Card class="w-full max-w-xs overflow-hidden shadow-lg" :pt="{ body: { class: 'p-0' }, content: { class: 'p-0' } }">
      <template #header>
        <div class="auth-card-header">
          <div class="flex items-center gap-2 mb-4">
            <span class="auth-logo-dot"></span>
            <span class="auth-brand">GroceryList</span>
          </div>
          <div class="auth-title">{{ i18n.t('auth.resetPasswordTitle') }}</div>
          <div class="auth-subtitle">{{ i18n.t('auth.resetPasswordSubtitle') }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <!-- Success -->
          <div v-if="mailSent" class="flex flex-col gap-5">
            <p class="text-4xl font-light">✓</p>
            <h3 class="text-lg font-medium">{{ i18n.t('auth.checkEmailTitle') }}</h3>
            <p class="text-sm leading-relaxed">{{ i18n.t('auth.checkEmailBody') }}</p>
            <NuxtLink to="/auth/login" class="block">
              <Button :label="i18n.t('auth.backToLogin')" severity="secondary" outlined class="w-full" />
            </NuxtLink>
          </div>

          <!-- Form -->
          <div v-else class="flex flex-col gap-5">
            <form @submit.prevent="handleResetPassword" class="flex flex-col gap-5">
              <div class="flex flex-col gap-1.5">
                <label>{{ i18n.t('auth.email') }}</label>
                <InputText
                  v-model="userData.email"
                  type="email"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full"
                />
              </div>
              <Button type="submit" :label="i18n.t('auth.sendBtn')" class="w-full" />
            </form>

            <NuxtLink to="/auth/login" class="text-sm">
              ← {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>

        </div>
      </template>
    </Card>

  </div>
</template>
