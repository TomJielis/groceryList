<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import { useNotification } from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'

const i18n = useI18nStore();
const { showNotification } = useNotification();
const route = useRoute();
const passwordUpdated = ref(false);
const { setNewPassword, checkResetLink } = useAuth();
// A used or expired link shows a 'request a new one' screen instead of the form
const linkExpired = ref(false);

const userData = ref({
  email: '',
  password: '',
  repeatPassword: '',
  token: route.params.id as string
});

onMounted(async () => {
  linkExpired.value = !(await checkResetLink(userData.value.token));
});

// Messages for the reasons the API gives
const reasonMessages: Record<string, string> = {
  invalid_link: 'auth.resetLinkInvalid',
  password_too_short: 'auth.passwordTooShort',
  passwords_do_not_match: 'auth.passwordsDoNotMatch',
};

function triggerNewPassword() {
  // The same rules as the API, checked here first so the user sees why straight away
  if (userData.value.password.length < 8) {
    showNotification(i18n.t('auth.passwordTooShort'));
    return;
  }
  if (userData.value.password !== userData.value.repeatPassword) {
    showNotification(i18n.t('auth.passwordsDoNotMatch'));
    return;
  }
  setNewPassword(userData.value)
    .then(() => { passwordUpdated.value = true; })
    .catch((error) => {
      // The link was used or expired in the meantime
      if (error?.reason === 'invalid_link') {
        linkExpired.value = true;
        return;
      }
      showNotification(i18n.t(reasonMessages[error?.reason] ?? 'errors.unexpectedError'));
    });
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
          <div class="auth-title">{{ i18n.t('auth.newPasswordTitle') }}</div>
          <div class="auth-subtitle">{{ i18n.t('auth.newPasswordSubtitle') }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <!-- Success -->
          <div v-if="passwordUpdated" class="flex flex-col gap-5">
            <p class="text-4xl font-light">✓</p>
            <h3 class="text-lg font-medium">{{ i18n.t('auth.passwordUpdatedTitle') }}</h3>
            <p class="text-sm leading-relaxed">{{ i18n.t('auth.passwordUpdatedBody') }}</p>
            <NuxtLink to="/auth/login" class="block">
              <Button :label="i18n.t('auth.goToLogin')" severity="secondary" outlined class="w-full" />
            </NuxtLink>
          </div>

          <!-- Used or expired link -->
          <div v-else-if="linkExpired" class="flex flex-col gap-5">
            <h3 class="text-lg font-medium">{{ i18n.t('auth.resetLinkExpiredTitle') }}</h3>
            <p class="text-sm leading-relaxed">{{ i18n.t('auth.resetLinkInvalid') }}</p>
            <NuxtLink to="/auth/password/reset" class="block">
              <Button :label="i18n.t('auth.requestNewLink')" class="w-full" />
            </NuxtLink>
            <NuxtLink to="/auth/login" class="block">
              <Button :label="i18n.t('auth.goToLogin')" severity="secondary" outlined class="w-full" />
            </NuxtLink>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="triggerNewPassword" class="flex flex-col gap-5">
            <input type="hidden" v-model="userData.token" />

            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('auth.email') }}</label>
              <InputText
                v-model="userData.email"
                type="email"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label>{{ i18n.t('auth.newPassword') }}</label>
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
              <label>{{ i18n.t('auth.repeatPassword') }}</label>
              <Password
                v-model="userData.repeatPassword"
                :placeholder="i18n.t('auth.repeatPasswordPlaceholder')"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full"
              />
            </div>

            <Button type="submit" :label="i18n.t('auth.resetPasswordBtn')" class="w-full" />
          </form>

        </div>
      </template>
    </Card>

  </div>
</template>
