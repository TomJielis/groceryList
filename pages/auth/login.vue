<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'
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
const languageToggleLabel = computed(() =>
  i18n.locale === 'en' ? `🇳🇱 ${i18n.t('nav.dutch')}` : `🇬🇧 ${i18n.t('nav.english')}`
)

useHead(() => ({
  title: t.value('auth.loginTitle'),
  meta: [{ name: 'description', content: t.value('app.metaDescription') }]
}))

const userData = ref({ email: '', password: '' })

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
  i18n.setLocale(i18n.locale === 'en' ? 'nl' : 'en')
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
          <div class="auth-title">{{ t('auth.loginTitle') }}</div>
          <div class="auth-subtitle">{{ t('auth.loginSubtitle') }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label>{{ t('auth.email') }}</label>
              <InputText
                v-model="userData.email"
                type="email"
                :placeholder="t('auth.emailPlaceholder')"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label>{{ t('auth.password') }}</label>
              <Password
                v-model="userData.password"
                :placeholder="t('auth.passwordPlaceholder')"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full"
              />
            </div>

            <Button
              type="submit"
              :label="t('auth.loginBtn')"
              class="w-full"
            />
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-3 text-sm">
            <span class="flex-1 h-px bg-surface-200"></span>
            <span>{{ t('auth.or') }}</span>
            <span class="flex-1 h-px bg-surface-200"></span>
          </div>

          <!-- Register -->
          <NuxtLink to="/auth/register" class="block">
            <Button
              :label="t('auth.createAccount')"
              severity="secondary"
              outlined
              class="w-full"
            />
          </NuxtLink>

          <!-- Footer -->
          <div class="flex justify-between">
            <NuxtLink to="/auth/password/reset" class="text-sm">
              {{ t('auth.forgotPassword') }}
            </NuxtLink>
            <button @click="toggleLanguage" class="text-sm bg-transparent border-0 cursor-pointer p-0">
              {{ languageToggleLabel }}
            </button>
          </div>

        </div>
      </template>
    </Card>

  </div>
</template>
