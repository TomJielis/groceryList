<script setup lang="ts">

import {ref} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "~/composables/useAuth";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();

const form = ref({
  token: '',
});

const hasError = ref(false)
const errorText = ref('')
const title = ref(i18n.t('auth.verifyEmailTitle'));
const body = ref(i18n.t('auth.verifyingEmail'));

const auth = useAuth();
const route = useRoute();

form.value.token = route.params.id as string;


auth.verifyEmail(form.value.token).then((data:any) => {
  title.value = i18n.t('auth.emailVerifiedTitle');
  body.value = i18n.t('auth.emailVerifiedBody');
}).catch((error) => {
  title.value = i18n.t('auth.emailVerifyFailedTitle');
  body.value = i18n.t('auth.emailVerifyFailedBody');
  hasError.value = true;
  errorText.value = error || i18n.t('auth.unexpectedError');
});

</script>

<template>
  <div class="min-h-[90dvh] bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white/90 dark:bg-slate-900/90 shadow-xl rounded-2xl p-8 border border-border-light dark:border-border-dark transition">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            class="w-14 h-14"
            alt="Grocery Cart Icon"
        />
        <h1 class="text-2xl font-bold text-accent dark:text-accent-light">{{title}}</h1>
        <p class="text-slate-700 dark:text-slate-100">
          {{body}}
        </p>
        <p v-if="hasError" class="w-full px-4 py-2 rounded-xl bg-error/10 text-error font-semibold">
          {{errorText}}
        </p>
        <NuxtLink
            to="/auth/login"
            class="mt-4 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2 rounded-xl shadow transition border border-accent/80 focus:ring-2 focus:ring-accent"
        >
          {{ i18n.t('auth.goToLogin') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
