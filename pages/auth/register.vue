<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
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
  <div class="min-h-full flex items-center justify-center py-16 px-6">
    <div class="w-full max-w-xs">

      <!-- Brand -->
      <div class="mb-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">Create account.</h1>
      </div>

      <!-- Success state -->
      <div v-if="verifyMailMessage" class="flex flex-col gap-5">
        <p class="text-4xl font-light text-[#fafafa]">✓</p>
        <h3 class="text-lg font-medium text-[#fafafa]">{{ i18n.t('auth.verifyMailMessageTitle') }}</h3>
        <p class="text-sm text-[#71717a] leading-relaxed">{{ i18n.t('auth.verifyMailMessageBody') }}</p>
        <div class="pt-5 border-t border-[#27272a]">
          <NuxtLink to="/auth/login" class="block">
            <Button :label="i18n.t('auth.backToLogin')" unstyled
              class="w-full bg-transparent border border-[#27272a] text-[#71717a] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors text-center block" />
          </NuxtLink>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleRegister" class="flex flex-col gap-7">
        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.name') }}</label>
          <InputText v-model="userData.name" :placeholder="i18n.t('auth.namePlaceholder')" unstyled
            class="w-full bg-transparent border-b border-[#27272a] px-0 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.email') }}</label>
          <InputText v-model="userData.email" type="email" :placeholder="i18n.t('auth.emailPlaceholder')"
            :disabled="isEmailDisabled" unstyled
            class="w-full bg-transparent border-b border-[#27272a] px-0 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46] disabled:opacity-40" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.password') }}</label>
          <Password v-model="userData.password" :placeholder="i18n.t('auth.passwordPlaceholder')" toggleMask
            :feedback="false" unstyled class="w-full"
            :pt="{
              root: { class: 'block w-full relative' },
              input: { class: 'w-full !bg-transparent border-b border-[#27272a] px-0 pr-6 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]' },
              hideIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
              showIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
            }" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('profile.language') }}</label>
          <SelectButton v-model="userData.language" :options="languageOptions" optionLabel="label" optionValue="value"
            unstyled @change="handleLanguageChange($event.value)"
            :pt="{
              root: { class: 'flex gap-2' },
              button: ({ context }: any) => ({
                class: [
                  'flex-1 py-2 rounded text-[0.7rem] font-medium border cursor-pointer transition-colors text-center',
                  context.active
                    ? 'bg-[#fafafa] text-[#18181b] border-[#fafafa]'
                    : 'bg-transparent text-[#71717a] border-[#27272a] hover:border-[#52525b] hover:text-[#a1a1aa]'
                ]
              })
            }" />
        </div>

        <div class="flex items-start gap-3">
          <Checkbox v-model="userData.acceptedTerms" binary inputId="terms" unstyled
            :pt="{
              box: ({ instance }: any) => ({
                class: [
                  'w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-colors',
                  instance?.checked ? 'bg-[#fafafa] border-[#fafafa]' : 'bg-transparent border-[#3f3f46]'
                ]
              }),
              icon: { class: 'text-[#18181b] text-[0.5rem]' }
            }" />
          <label for="terms" class="text-sm text-[#71717a] leading-relaxed cursor-pointer" v-html="i18n.t('register.acceptTerms')" />
        </div>

        <Button type="submit" :label="i18n.t('auth.registerBtn')" unstyled
          class="w-full bg-[#fafafa] text-[#18181b] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:bg-[#d4d4d8] transition-colors text-center" />

        <p class="text-[0.72rem] text-[#52525b] text-center">
          {{ i18n.t('auth.alreadyHaveAccount') }}
          <NuxtLink to="/auth/login" class="text-[#a1a1aa] hover:text-[#fafafa] transition-colors ml-1">{{ i18n.t('nav.login') }}</NuxtLink>
        </p>
      </form>

    </div>
  </div>
</template>
