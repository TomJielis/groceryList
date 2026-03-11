<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
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
  <div class="min-h-full flex items-center justify-center py-16 px-6">
    <div class="w-full max-w-xs">

      <!-- Brand -->
      <div class="mb-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">Welcome back.</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-7">
        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ t('auth.email') }}</label>
          <InputText
            v-model="userData.email"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
            unstyled
            class="w-full bg-transparent border-b border-[#27272a] px-0 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ t('auth.password') }}</label>
          <Password
            v-model="userData.password"
            :placeholder="t('auth.passwordPlaceholder')"
            toggleMask
            :feedback="false"
            unstyled
            class="w-full"
            :pt="{
              root: { class: 'block w-full relative' },
              input: { class: 'w-full !bg-transparent border-b border-[#27272a] px-0 pr-6 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]' },
              hideIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
              showIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
            }"
          />
        </div>

        <Button
          type="submit"
          :label="t('auth.loginBtn')"
          unstyled
          class="w-full bg-[#fafafa] text-[#18181b] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:bg-[#d4d4d8] transition-colors text-center"
        />
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-5 text-[#3f3f46] text-[0.7rem]">
        <span class="flex-1 h-px bg-[#27272a]"></span>
        <span>{{ t('auth.or') }}</span>
        <span class="flex-1 h-px bg-[#27272a]"></span>
      </div>

      <!-- Register -->
      <NuxtLink to="/auth/register" class="block">
        <Button
          :label="t('auth.createAccount')"
          unstyled
          class="w-full bg-transparent border border-[#27272a] text-[#71717a] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors text-center block"
        />
      </NuxtLink>

      <!-- Footer -->
      <div class="flex justify-between mt-7">
        <NuxtLink to="/auth/password/reset" class="text-[0.72rem] text-[#52525b] hover:text-[#a1a1aa] transition-colors">
          {{ t('auth.forgotPassword') }}
        </NuxtLink>
        <button @click="toggleLanguage" class="text-[0.72rem] text-[#52525b] hover:text-[#a1a1aa] transition-colors bg-transparent border-0 cursor-pointer p-0">
          {{ languageToggleLabel }}
        </button>
      </div>

    </div>
  </div>
</template>
