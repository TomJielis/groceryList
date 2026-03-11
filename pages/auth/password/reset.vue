<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
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
  <div class="min-h-full flex items-center justify-center py-16 px-6">
    <div class="w-full max-w-xs">

      <!-- Brand -->
      <div class="mb-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">Reset password.</h1>
      </div>

      <!-- Success -->
      <div v-if="mailSent" class="flex flex-col gap-5">
        <p class="text-4xl font-light text-[#fafafa]">✓</p>
        <h3 class="text-lg font-medium text-[#fafafa]">{{ i18n.t('auth.checkEmailTitle') }}</h3>
        <p class="text-sm text-[#71717a] leading-relaxed">{{ i18n.t('auth.checkEmailBody') }}</p>
        <div class="pt-5 border-t border-[#27272a]">
          <NuxtLink to="/auth/login" class="block">
            <Button :label="i18n.t('auth.backToLogin')" unstyled
              class="w-full bg-transparent border border-[#27272a] text-[#71717a] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors text-center block" />
          </NuxtLink>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="flex flex-col gap-7">
        <form @submit.prevent="handleResetPassword" class="flex flex-col gap-7">
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.email') }}</label>
            <InputText v-model="userData.email" type="email" :placeholder="i18n.t('auth.emailPlaceholder')" unstyled
              class="w-full bg-transparent border-b border-[#27272a] px-0 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]" />
          </div>
          <Button type="submit" :label="i18n.t('auth.sendBtn')" unstyled
            class="w-full bg-[#fafafa] text-[#18181b] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:bg-[#d4d4d8] transition-colors text-center" />
        </form>

        <div class="pt-5 border-t border-[#27272a]">
          <NuxtLink to="/auth/login" class="text-[0.72rem] text-[#52525b] hover:text-[#a1a1aa] transition-colors">
            ← {{ i18n.t('auth.backToLogin') }}
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
