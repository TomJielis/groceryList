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
  <div class="h-[90dvh] bg-[#f1fdf3] flex items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            class="w-14 h-14"
        />
        <h1 class="text-2xl font-bold text-green-600">{{title}}</h1>
        <p class="text-gray-600">
          {{body}}
        </p>

        <p v-if="hasError">
          {{errorText}}
        </p>
        <NuxtLink
            to="/auth/login"
            class="mt-4 bg-green-500 font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          {{ i18n.t('auth.goToLogin') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
