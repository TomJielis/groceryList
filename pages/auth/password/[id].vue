<script setup lang="ts">

import {ref} from "vue";
import { useAuth} from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();
const {showNotification} = useNotification();
const route = useRoute();
const passwordUpdated = ref(false);

const { setNewPassword } = useAuth();
const userData = ref({
  email: '',
  password: '',
  repeatPassword: '',
  token: route.params.id as string
});

function triggerNewPassword()
{
  setNewPassword(userData.value)
      .then(() => {
        passwordUpdated.value = true;
      })
      .catch(() => {
        showNotification(i18n.t('errors.unexpectedError'));
      });
}

</script>

<template>
  <div class="min-h-[90dvh] bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white/90 dark:bg-slate-900/90 shadow-xl rounded-2xl p-8 border border-border-light dark:border-border-dark transition">
      <div class="flex flex-col items-center space-y-4">
      <div v-if="!passwordUpdated">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-6 ">
          🛒 {{ i18n.t('auth.resetPasswordTitle') }}
        </h2>
        <form @submit.prevent="triggerNewPassword" class="space-y-5">
          <input type="text"
                 id="token"
                 v-model="userData.token"
                 class="hidden"
          />
          <div>
            <formInput
              :label="i18n.t('auth.email')"
              :inputType="'email'"
              v-model="userData.email"
              :placeholder="i18n.t('auth.emailPlaceholder')"
              required
            />
          </div>
          <div>
            <formInput
              :label="i18n.t('auth.password')"
              :inputType="'password'"
              v-model="userData.password"
              :placeholder="i18n.t('auth.password')"
              required
            />
          </div>
          <div>
            <formInput
              :label="i18n.t('auth.repeatPassword')"
              :inputType="'password'"
              v-model="userData.repeatPassword"
              :placeholder="i18n.t('auth.repeatPassword')"
              required
            />
          </div>
          <button type="submit" class="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold">
            {{ i18n.t('auth.resetPasswordBtn') }}
          </button>
        </form>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold">
          {{ i18n.t('auth.passwordUpdatedTitle') }}
        </h2>
        <p class="text-sm ">
          {{ i18n.t('auth.passwordUpdatedBody') }}
        </p>
      </div>
      </div>
    </div>
  </div>
</template>
