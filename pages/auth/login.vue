<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'

const router = useRouter()
const authStore = useAuthStore()

const { login } = useAuth()
const { showNotification } = useNotification()

const i18n = useI18nStore()
const t = computed(() => i18n.t)

useHead(() => ({
  title: t.value('auth.loginTitle'),
  meta: [
    {
      name: 'description',
      content: t.value('app.metaDescription')
    }
  ]
}))

const userData = ref({
  email: '',
  password: ''
})

async function handleLogin() {
  try {
    const data = await login(userData.value)

    authStore.setUser(data.user)
    authStore.setToken(data.token)

    i18n.setLocale(data.user.language || 'nl')

    router.push('/')
  } catch (error) {
    showNotification(error)
  }
}

function toggleLanguage() {
  const newLocale = i18n.locale === 'en' ? 'nl' : 'en'
  i18n.setLocale(newLocale)
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-slate-900 px-4">
    <Card class="w-full max-w-md shadow-2">
      <template #title>
        <div class="text-center mb-2">
          <div class="text-4xl mb-2">🛒</div>
          <h2 class="text-2xl font-bold">
            {{ t('nav.login') }}
          </h2>
          <p class="text-sm text-slate-400">
            {{ t('auth.loginSubtitle') }}
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block mb-2 text-sm">
              {{ t('auth.email') }}
            </label>

            <InputText
                v-model="userData.email"
                type="email"
                :placeholder="t('auth.emailPlaceholder')"
                class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm">
              {{ t('auth.password') }}
            </label>

            <Password
                v-model="userData.password"
                :placeholder="t('auth.passwordPlaceholder')"
                toggleMask
                :feedback="false"
                inputClass="w-full"
                class="w-full"
            />
          </div>

          <Button
              type="submit"
              icon="pi pi-sign-in"
              :label="t('auth.loginBtn')"
              class="w-full"
          />

        </form>

        <div class="mt-6">
          <NuxtLink
              to="/auth/password/reset"
              class="block text-center text-sm text-primary mb-4"
          >
            {{ t('auth.forgotPassword') }}
          </NuxtLink>
          <Divider align="center">
            {{ t('auth.or') }}
          </Divider>
          <NuxtLink to="/auth/register">
            <Button
                severity="secondary"
                outlined
                class="w-full mt-4"
                :label="t('auth.createAccount')"
            />
          </NuxtLink>
        </div>
        <div class="flex justify-center mt-6">
          <Button
              outlined
              severity="contrast"
              @click="toggleLanguage"
              :label="i18n.locale === 'en' ? '🇳🇱 Nederlands' : '🇬🇧 English'"
          />
        </div>
      </template>

    </Card>

  </div>
</template>