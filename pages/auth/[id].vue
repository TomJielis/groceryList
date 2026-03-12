<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useI18nStore } from '~/stores/i18n';
import Button from 'primevue/button'
import Card from 'primevue/card'
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
  <div class="auth-page min-h-full flex items-center justify-center py-16 px-6">

    <Card class="w-full max-w-xs overflow-hidden shadow-lg" :pt="{ body: { class: 'p-0' }, content: { class: 'p-0' } }">
      <template #header>
        <div class="auth-card-header">
          <div class="flex items-center gap-2 mb-4">
            <span class="auth-logo-dot"></span>
            <span class="auth-brand">GroceryList</span>
          </div>
          <div class="auth-title">{{ title }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <div v-if="!hasError && !verified">
            <ProgressSpinner style="width:28px;height:28px" strokeWidth="3" />
          </div>

          <p class="text-sm leading-relaxed">{{ body }}</p>

          <div v-if="hasError" class="px-4 py-3 border rounded">
            <p class="text-sm" style="color: var(--p-red-500)">{{ errorText }}</p>
          </div>

          <NuxtLink to="/auth/login" class="block">
            <Button :label="i18n.t('auth.goToLogin')" class="w-full" />
          </NuxtLink>

        </div>
      </template>
    </Card>

  </div>
</template>
