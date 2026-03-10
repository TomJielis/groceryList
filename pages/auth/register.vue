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
  <div class="min-h-screen flex justify-center items-center bg-slate-900 px-4">
    <Card class="w-full max-w-md shadow-2">
      <template #title>
        <div class="text-center">
          <div class="text-4xl mb-2">📝</div>

          <h2 class="text-2xl font-bold">
            {{ i18n.t('auth.registerTitle') }}
          </h2>

          <p class="text-sm text-slate-400">
            {{ i18n.t('auth.registerSubtitle') }}
          </p>
        </div>
      </template>
      <template #content>
        <div v-if="!verifyMailMessage">

          <form
              @submit.prevent="handleRegister"
              class="space-y-4 mt-4"
          >
            <div>
              <label class="block mb-2 text-sm">
                {{ i18n.t('auth.name') }}
              </label>
              <InputText
                  v-model="userData.name"
                  :placeholder="i18n.t('auth.namePlaceholder')"
                  class="w-full"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm">
                {{ i18n.t('auth.email') }}
              </label>
              <InputText
                  v-model="userData.email"
                  type="email"
                  :disabled="isEmailDisabled"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm">
                {{ i18n.t('auth.password') }}
              </label>
              <Password
                  v-model="userData.password"
                  toggleMask
                  :feedback="false"
                  inputClass="w-full"
                  class="w-full"
                  :placeholder="i18n.t('auth.passwordPlaceholder')"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm">
                {{ i18n.t('profile.language') }}
              </label>
              <SelectButton
                  v-model="userData.language"
                  :options="languageOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  @change="handleLanguageChange($event.value)"
              />
            </div>
            <div class="flex items-start gap-3 mt-2">
              <Checkbox
                  v-model="userData.acceptedTerms"
                  binary
                  inputId="terms"
              />
              <label
                  for="terms"
                  class="text-sm text-slate-400"
                  v-html="i18n.t('register.acceptTerms')"
              />
            </div>
            <Button
                type="submit"
                icon="pi pi-user-plus"
                class="w-full mt-2"
                :label="i18n.t('auth.registerBtn')"
            />
          </form>
        </div>
        <div
            v-else
            class="text-center py-6"
        >
          <div class="text-4xl mb-3">
            📧
          </div>
          <h3 class="text-xl font-semibold mb-2">
            {{ i18n.t('auth.verifyMailMessageTitle') }}
          </h3>
          <p class="text-sm text-slate-400 mb-6">
            {{ i18n.t('auth.verifyMailMessageBody') }}
          </p>
          <NuxtLink to="/auth/login">
            <Button
                severity="secondary"
                outlined
                :label="i18n.t('auth.backToLogin')"
            />
          </NuxtLink>
        </div>
        <div
            v-if="!verifyMailMessage"
            class="text-center mt-6 text-sm text-slate-400"
        >
          {{ i18n.t('auth.alreadyHaveAccount') }}

          <NuxtLink
              to="/auth/login"
              class="text-primary font-medium ml-1"
          >
            {{ i18n.t('nav.login') }}
          </NuxtLink>
        </div>
      </template>
    </Card>
  </div>
</template>