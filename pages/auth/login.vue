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
const languageToggleLabel = computed(() =>
  i18n.locale === 'en'
    ? `🇳🇱 ${i18n.t('nav.dutch')}`
    : `🇬🇧 ${i18n.t('nav.english')}`
)

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
  <div class="auth-shell px-4 py-6">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center">
      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">✨</div>
            <h2 class="text-2xl font-semibold">
              {{ t('nav.login') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ t('auth.loginSubtitle') }}
            </p>
          </div>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block mb-2 text-sm text-slate-200">
              {{ t('auth.email') }}
            </label>

            <InputText
                v-model="userData.email"
                type="email"
                :placeholder="t('auth.emailPlaceholder')"
                class="w-full auth-input"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm text-slate-200">
              {{ t('auth.password') }}
            </label>

            <Password
                v-model="userData.password"
                :placeholder="t('auth.passwordPlaceholder')"
                toggleMask
                :feedback="false"
                inputClass="w-full"
                class="w-full auth-input"
            />
          </div>

          <Button
              type="submit"
              icon="pi pi-sign-in"
              :label="t('auth.loginBtn')"
              class="w-full auth-btn"
          />

        </form>

        <div class="mt-6 text-sm">
          <NuxtLink
              to="/auth/password/reset"
              class="block text-center text-emerald-300 hover:text-emerald-200 transition mb-4"
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
                class="w-full mt-4 auth-btn alt"
                :label="t('auth.createAccount')"
            />
          </NuxtLink>
        </div>
        <div class="flex justify-center mt-6">
          <Button
              outlined
              severity="contrast"
              @click="toggleLanguage"
              class="auth-lang"
              :label="languageToggleLabel"
          />
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

.auth-hero {
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(30px);
}

:deep(.auth-card .p-card-body) {
  background: rgba(15, 23, 42, 0.8);
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

.auth-btn :deep(.p-button) {
  border-radius: 999px;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  color: #0f172a;
  border: none;
  font-weight: 600;
  width: 100%;
}

.auth-btn.alt :deep(.p-button) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #f8fafc;
}

.auth-lang :deep(.p-button) {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #f8fafc;
}

:deep(.p-divider .p-divider-content) {
  color: #cbd5f5;
}
</style>
