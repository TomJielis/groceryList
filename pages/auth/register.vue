<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import SelectButton from 'primevue/selectbutton'
import Card from 'primevue/card'
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
  email: emailFromUrl ?? '',
  password: '',
  language: i18n.locale,
  acceptedTerms: false
})

const verifyMailMessage = ref(false)

const languageOptions = computed(() => [
  { label: `🇳🇱 ${i18n.t('nav.dutch')}`, value: 'nl' },
  { label: `🇬🇧 ${i18n.t('nav.english')}`, value: 'en' }
])

async function handleRegister() {
  try {
    await register({ ...userData.value, language: i18n.locale })
    verifyMailMessage.value = true
  } catch (error) {
    verifyMailMessage.value = false
    showNotification(error)
  }
}

watch(() => i18n.locale, (newLocale) => { userData.value.language = newLocale })

function handleLanguageChange(locale: 'nl' | 'en') {
  i18n.setLocale(locale)
  userData.value.language = locale
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
          <div class="auth-title">{{ i18n.t('auth.registerTitle') }}</div>
          <div class="auth-subtitle">{{ i18n.t('auth.registerSubtitle') }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <!-- Success state -->
          <div v-if="verifyMailMessage" class="flex flex-col gap-5">
            <p class="text-4xl font-light">✓</p>
            <h3 class="text-lg font-medium">{{ i18n.t('auth.verifyMailMessageTitle') }}</h3>
            <p class="text-sm leading-relaxed">{{ i18n.t('auth.verifyMailMessageBody') }}</p>
            <NuxtLink to="/auth/login" class="block">
              <Button :label="i18n.t('auth.backToLogin')" severity="secondary" outlined class="w-full" />
            </NuxtLink>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleRegister" class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('auth.name') }}</label>
              <InputText v-model="userData.name" :placeholder="i18n.t('auth.namePlaceholder')" class="w-full" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('auth.email') }}</label>
              <InputText
                v-model="userData.email"
                type="email"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                :disabled="isEmailDisabled"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('auth.password') }}</label>
              <Password
                v-model="userData.password"
                :placeholder="i18n.t('auth.passwordPlaceholder')"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('profile.language') }}</label>
              <SelectButton
                v-model="userData.language"
                :options="languageOptions"
                optionLabel="label"
                optionValue="value"
                @change="handleLanguageChange($event.value)"
              />
            </div>

            <div class="flex items-start gap-3">
              <Checkbox v-model="userData.acceptedTerms" binary inputId="terms" />
              <label for="terms" class="text-sm leading-relaxed cursor-pointer" v-html="i18n.t('register.acceptTerms')" />
            </div>

            <Button type="submit" :label="i18n.t('auth.registerBtn')" class="w-full" />

            <p class="text-sm text-center">
              {{ i18n.t('auth.alreadyHaveAccount') }}
              <NuxtLink to="/auth/login" class="ml-1">{{ i18n.t('nav.login') }}</NuxtLink>
            </p>
          </form>

        </div>
      </template>
    </Card>

  </div>
</template>
