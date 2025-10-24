<script setup lang="ts">
import { ref, computed } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();
const t = computed(() => i18n.t);
const {showNotification} = useNotification();
const {resetPassword} = useAuth();
const mailSent = ref(false);
const userData = ref({
  email: '',
});

useHead(() => ({
  title: t.value('auth.resetPasswordTitle'),
  meta: [
    {
      name: 'description',
      content: t.value('app.metaDescription')
    }
  ]
}));

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
  <div class="h-[90vh] flex items-center justify-center px-4">
    <div class="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-border-light dark:border-border-dark">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-accent-light">📝 {{ t('auth.resetPasswordTitle') }}</h2>
      </div>

      <div v-if="!mailSent">
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{ t('auth.email') }}</label>
            <input
                type="email"
                id="email"
                v-model="userData.email"
                class="block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 text-base transition-colors"
                :placeholder="t('auth.emailPlaceholder')"
                required
            />
          </div>
          <button
              type="submit"
              class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
          >
            {{ t('auth.sendBtn') }}
          </button>
        </form>
        <p class="text-sm text-center text-gray-600 mt-6">
          <a href="/auth/login" class="text-green-500 hover:underline font-medium">{{ t('auth.alreadyHaveAccount') }}</a>
        </p>
      </div>

      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-accent-light">📝 {{ t('auth.checkEmailTitle') }}</h2>
        <p class="text-sm text-slate-700 dark:text-slate-300">{{ t('auth.checkEmailBody') }}</p>
      </div>
    </div>
  </div>
</template>
