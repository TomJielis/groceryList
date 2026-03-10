<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import SelectButton from 'primevue/selectbutton'

import { useAuth } from '~/composables/useAuth'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'

const route = useRoute()

const i18n = useI18nStore()
const { showNotification } = useNotification()
const { register } = useAuth()

const emailFromUrl = route.query.email as string | undefined

const isEmailDisabled = computed(() => !!emailFromUrl)

const userData = ref({
  name: '',
  email: emailFromUrl ? emailFromUrl : '',
  password: '',
  language: i18n.locale,
  acceptedTerms: false
})

const verifyMailMessage = ref(false)

const languageOptions = [
  { label: '🇳🇱 Nederlands', value: 'nl' },
  { label: '🇬🇧 English', value: 'en' }
]

async function handleRegister() {
  const registrationData = {
    ...userData.value,
    language: i18n.locale
  }

  try {
    await register(registrationData)
    verifyMailMessage.value = true
  } catch (error) {
    verifyMailMessage.value = false
    showNotification(error)
  }
}

watch(() => i18n.locale, (newLocale) => {
  userData.value.language = newLocale
})

function handleLanguageChange(locale: 'nl' | 'en') {
  i18n.setLocale(locale)
  userData.value.language = locale
}
</script>

<template>
  <div class="auth-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center md:grid-cols-2">
      <div class="auth-hero rounded-3xl border border-white/10 shadow-2xl p-8 text-white space-y-4">
        <div class="text-5xl">📝</div>
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-slate-300">
            {{ i18n.t('auth.joinCommunity') || 'Invite friends' }}
          </p>
          <h1 class="text-3xl md:text-4xl font-bold leading-tight">
            {{ i18n.t('auth.registerTitle') }}
          </h1>
        </div>
        <p class="text-sm text-slate-200 max-w-sm">
          {{ i18n.t('auth.registerSubtitle') }}
        </p>
        <ul class="space-y-2 text-sm text-slate-200">
          <li class="flex items-center gap-2">
            <span class="text-emerald-300">✓</span> {{ i18n.t('lists.sharedWith') }}
          </li>
          <li class="flex items-center gap-2">
            <span class="text-emerald-300">✓</span> {{ i18n.t('auth.realTime') || 'Realtime sync' }}
          </li>
          <li class="flex items-center gap-2">
            <span class="text-emerald-300">✓</span> {{ i18n.t('auth.freeForever') || 'Gratis account' }}
          </li>
        </ul>
      </div>

      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">🎉</div>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('auth.registerTitle') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ i18n.t('auth.registerSubtitle') }}
            </p>
          </div>
        <div v-if="!verifyMailMessage">

          <form
              @submit.prevent="handleRegister"
              class="space-y-4"
          >
            <div>
              <label class="block mb-2 text-sm text-slate-200">
                {{ i18n.t('auth.name') }}
              </label>
              <InputText
                  v-model="userData.name"
                  :placeholder="i18n.t('auth.namePlaceholder')"
                  class="w-full auth-input"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm text-slate-200">
                {{ i18n.t('auth.email') }}
              </label>
              <InputText
                  v-model="userData.email"
                  type="email"
                  :disabled="isEmailDisabled"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full auth-input"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm text-slate-200">
                {{ i18n.t('auth.password') }}
              </label>
              <Password
                  v-model="userData.password"
                  toggleMask
                  :feedback="false"
                  inputClass="w-full"
                  class="w-full auth-input"
                  :placeholder="i18n.t('auth.passwordPlaceholder')"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm text-slate-200">
                {{ i18n.t('profile.language') }}
              </label>
              <SelectButton
                  v-model="userData.language"
                  :options="languageOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full auth-select"
                  @change="handleLanguageChange($event.value)"
              />
            </div>
            <div class="flex items-start gap-3 mt-2">
              <Checkbox
                  v-model="userData.acceptedTerms"
                  binary
                  inputId="terms"
                  class="auth-checkbox"
              />
              <label
                  for="terms"
                  class="text-sm text-slate-200"
                  v-html="i18n.t('register.acceptTerms')"
              />
            </div>
            <Button
                type="submit"
                icon="pi pi-user-plus"
                class="w-full auth-btn"
                :label="i18n.t('auth.registerBtn')"
            />
          </form>
        </div>
        <div
            v-else
            class="text-center py-6 text-white space-y-4"
        >
          <div class="text-4xl mb-3">
            📧
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ i18n.t('auth.verifyMailMessageTitle') }}
          </h3>
          <p class="text-sm text-slate-200 mb-6">
            {{ i18n.t('auth.verifyMailMessageBody') }}
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
        <div
            v-if="!verifyMailMessage"
            class="text-center mt-6 text-sm text-slate-300"
        >
          {{ i18n.t('auth.alreadyHaveAccount') }}

          <NuxtLink
              to="/auth/login"
              class="text-emerald-300 font-medium ml-1"
          >
            {{ i18n.t('nav.login') }}
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
  background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.4), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(25px);
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

:deep(.auth-input.p-inputtext),
:deep(.auth-input .p-password-input) {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
}

:deep(.auth-input.p-inputtext::placeholder),
:deep(.auth-input .p-password-input::placeholder) {
  color: #cbd5f5;
}

:deep(.auth-select .p-selectbutton .p-button) {
  flex: 1;
  border-radius: 999px !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #f8fafc;
}

:deep(.auth-select .p-selectbutton .p-button.p-highlight) {
  background: linear-gradient(90deg, #34d399, #10b981);
  color: #0f172a;
}

:deep(.auth-checkbox .p-checkbox-box) {
  border-radius: 0.6rem;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(15, 23, 42, 0.8);
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

:deep(.p-divider .p-divider-content) {
  color: #cbd5f5;
}
</style>
