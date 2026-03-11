<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useI18nStore } from '~/stores/i18n';
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const i18n = useI18nStore();
const form = ref({ token: '' });
const hasError = ref(false)
const verified = ref(false)
const errorText = ref('')
const title = ref(i18n.t('auth.verifyEmailTitle'));
const body = ref(i18n.t('auth.verifyingEmail'));

const auth = useAuth();
const route = useRoute();
form.value.token = route.params.id as string;

auth.verifyEmail(form.value.token).then(() => {
  title.value = i18n.t('auth.emailVerifiedTitle');
  body.value = i18n.t('auth.emailVerifiedBody');
  verified.value = true;
}).catch((error) => {
  title.value = i18n.t('auth.emailVerifyFailedTitle');
  body.value = i18n.t('auth.emailVerifyFailedBody');
  hasError.value = true;
  errorText.value = error || i18n.t('auth.unexpectedError');
});
</script>

<template>
  <div class="min-h-full flex items-center justify-center py-16 px-6">
    <div class="w-full max-w-xs">

      <!-- Brand -->
      <div class="mb-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">{{ title }}</h1>
      </div>

      <div class="flex flex-col gap-5">
        <div v-if="!hasError && !verified">
          <ProgressSpinner style="width:28px;height:28px" strokeWidth="3"
            :pt="{ circle: { style: 'stroke: #52525b' } }" />
        </div>

        <p class="text-sm text-[#71717a] leading-relaxed">{{ body }}</p>

        <div v-if="hasError" class="px-4 py-3 border border-[#3f1515] rounded bg-[#1f0a0a]">
          <p class="text-sm text-[#f87171]">{{ errorText }}</p>
        </div>

        <div class="pt-5 border-t border-[#27272a]">
          <NuxtLink to="/auth/login" class="block">
            <Button :label="i18n.t('auth.goToLogin')" unstyled
              class="w-full bg-[#fafafa] text-[#18181b] py-3 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] cursor-pointer hover:bg-[#d4d4d8] transition-colors text-center block" />
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
