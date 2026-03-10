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
  <div class="min-h-screen flex justify-center items-center bg-slate-900 px-4">
    <Card class="w-full max-w-md shadow-2">
      <template #title>
        <div class="text-center">
          <div class="text-4xl mb-2">🔑</div>

          <h2 class="text-2xl font-bold">
            {{ i18n.t('auth.resetPasswordTitle') }}
          </h2>

          <p class="text-sm text-slate-400">
            {{ i18n.t('auth.resetPasswordSubtitle') }}
          </p>
        </div>
      </template>
      <template #content>
        <div v-if="!mailSent">
          <form
              @submit.prevent="handleResetPassword"
              class="space-y-4 mt-4"
          >
            <div>
              <label class="block mb-2 text-sm">
                {{ i18n.t('auth.email') }}
              </label>

              <InputText
                  v-model="userData.email"
                  type="email"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full"
              />
            </div>
            <Button
                type="submit"
                icon="pi pi-send"
                class="w-full"
                :label="i18n.t('auth.sendBtn')"
            />
          </form>
          <div class="text-center mt-6">
            <NuxtLink
                to="/auth/login"
                class="text-primary text-sm"
            >
              ← {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>
        <div
            v-else
            class="text-center py-6"
        >
          <div class="text-4xl mb-3">
            📧
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ i18n.t('auth.checkEmailTitle') }}
          </h3>
          <p class="text-sm text-slate-400 mb-6">
            {{ i18n.t('auth.checkEmailBody') }}
          </p>
          <NuxtLink to="/auth/login">
            <Button
                severity="secondary"
                outlined
                :label="i18n.t('auth.backToLogin')"
            />
          </NuxtLink>
        </div>
      </template>
    </Card>
  </div>
</template>