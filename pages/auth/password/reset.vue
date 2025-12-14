<script setup lang="ts">
import {ref} from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useNotification} from "~/composables/useNotification";
import {useI18nStore} from '~/stores/i18n';

const i18n = useI18nStore();
const {showNotification} = useNotification();
const {resetPassword} = useAuth();
const mailSent = ref(false);
const userData = ref({
  email: '',
});


function handleResetPassword() {
  resetPassword(userData.value)
      .then(() => {
        mailSent.value = true;
      })
      .catch(() => {
        showNotification(i18n.t('errors.passwordResetFailed'));
      });
}
</script>

<template>
  <div class="min-h-[90dvh] bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 ">
    <div
        class="max-w-md w-full bg-white/90 dark:bg-slate-900/90 shadow-xl rounded-2xl p-8 border border-border-light dark:border-border-dark transition">
      <div v-if="!mailSent">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 ">
          📝 {{ i18n.t('auth.resetPasswordTitle') }}
        </h2>
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <formInput :label="i18n.t('auth.email')"
                       :inputType="'email'"
                       v-model="userData.email"
                       :placeholder="i18n.t('auth.emailPlaceholder')"
                       required />
          </div>
          <button
              type="submit"
              class="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
          >
            {{ i18n.t('auth.sendBtn') }}
          </button>
        </form>
        <p class="text-sm text-center text-gray-600 mt-6">
          <nuxtLink to="/auth/login" class="text-green-500 hover:underline font-medium">
            {{ i18n.t('auth.alreadyHaveAccount') }}
          </nuxtLink>
        </p>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold ">
          📝 {{ i18n.t('auth.checkEmailTitle') }}
        </h2>
        <p class="text-sm ">
          {{ i18n.t('auth.checkEmailBody') }}
        </p>
      </div>
    </div>
  </div>
</template>
