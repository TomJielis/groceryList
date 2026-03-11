<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import { useNotification } from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const i18n = useI18nStore();
const { showNotification } = useNotification();
const route = useRoute();
const passwordUpdated = ref(false);
const { setNewPassword } = useAuth();

const userData = ref({
  email: '',
  password: '',
  repeatPassword: '',
  token: route.params.id as string
});

function triggerNewPassword() {
  setNewPassword(userData.value)
    .then(() => { passwordUpdated.value = true; })
    .catch(() => { showNotification(i18n.t('errors.unexpectedError')); });
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center py-16 px-6">
    <div class="w-full max-w-xs">

      <!-- Brand -->
      <div class="mb-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">New password.</h1>
      </div>

      <!-- Success -->
      <div v-if="passwordUpdated" class="flex flex-col gap-5">
        <p class="text-4xl font-light text-[#fafafa]">✓</p>
        <h3 class="text-lg font-medium text-[#fafafa]">{{ i18n.t('auth.passwordUpdatedTitle') }}</h3>
        <p class="text-sm text-[#71717a] leading-relaxed">{{ i18n.t('auth.passwordUpdatedBody') }}</p>
        <div class="pt-5 border-t border-[#27272a]">
          <NuxtLink to="/auth/login" class="block">
            <Button :label="i18n.t('auth.goToLogin')" unstyled
              class="w-full bg-transparent border border-[#27272a] text-[#71717a] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors text-center block" />
          </NuxtLink>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="triggerNewPassword" class="flex flex-col gap-7">
        <input type="hidden" v-model="userData.token" />

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.email') }}</label>
          <InputText v-model="userData.email" type="email" :placeholder="i18n.t('auth.emailPlaceholder')" unstyled
            class="w-full bg-transparent border-b border-[#27272a] px-0 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.newPassword') }}</label>
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
          <label class="text-[0.65rem] uppercase tracking-[0.1em] text-[#52525b] font-medium">{{ i18n.t('auth.repeatPassword') }}</label>
          <Password v-model="userData.repeatPassword" :placeholder="i18n.t('auth.repeatPasswordPlaceholder')"
            toggleMask :feedback="false" unstyled class="w-full"
            :pt="{
              root: { class: 'block w-full relative' },
              input: { class: 'w-full !bg-transparent border-b border-[#27272a] px-0 pr-6 py-2 text-[#fafafa] text-sm outline-none focus:border-[#71717a] transition-colors placeholder:text-[#3f3f46]' },
              hideIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
              showIcon: { class: 'absolute right-0 top-1/2 -translate-y-1/2 text-[#52525b] cursor-pointer text-base leading-none' },
            }" />
        </div>

        <Button type="submit" :label="i18n.t('auth.resetPasswordBtn')" unstyled
          class="w-full bg-[#fafafa] text-[#18181b] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:bg-[#d4d4d8] transition-colors text-center" />
      </form>

    </div>
  </div>
</template>
