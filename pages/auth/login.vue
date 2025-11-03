<script setup lang="ts">
import { ref, computed } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from "~/stores/i18n";

const i18n = useI18nStore();
const t = computed(() => i18n.t);

useHead(() => ({
  title: t.value('auth.loginTitle'),
  meta: [
    {
      name: 'description',
      content: t.value('app.metaDescription')
    }
  ]
}))

const {showNotification} = useNotification();
const { login } = useAuth();
const authStore = useAuthStore();
const router = useRouter();

const userData = ref({
  email: '',
  password: ''
});

function handleLogin() {
  login(userData.value)
    .then((data) => {
      authStore.setUser(data.user);
      authStore.setToken(data.token);
      i18n.setLocale(data.user.language || 'nl');

      router.push('/');
    })
    .catch((error) => {
      showNotification(error);
    });
}

function toggleLanguage() {
  const newLocale = i18n.locale === 'en' ? 'nl' : 'en';
  i18n.setLocale(newLocale);
}
</script>

<template>
  <div class="h-[90dvh] flex items-center justify-center px-4">
    <div class="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-border-light dark:border-border-dark">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-accent-light">🛒 {{ t('nav.login') }}</h2>
        <button
          @click="toggleLanguage"
          class="text-sm bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1 rounded-lg transition border border-accent/30"
          type="button"
        >
          {{ i18n.locale === 'en' ? 'NL' : 'EN' }}
        </button>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{ t('auth.email') }}</label>
          <input
              type="email"
              id="email"
              v-model="userData.email"
              class="block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 text-base transition-colors"
              :placeholder="i18n.t('auth.emailPlaceholder')"
              required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{ i18n.t('auth.password') }}</label>
          <input
              type="password"
              id="password"
              v-model="userData.password"
              class="block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 text-base transition-colors"
              :placeholder="i18n.t('auth.passwordPlaceholder')"
              required
          />
        </div>
        <button
            type="submit"
            class="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
        >
          {{ t('auth.loginBtn') }}
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-6">
        <a href="/auth/password/reset" class="text-green-500 hover:underline font-medium">{{ t('auth.forgotPassword') }}</a>
      </p>
      <p class="text-sm text-center text-gray-600 mt-6">
        <a href="/auth/register" class="text-green-500 hover:underline font-medium">{{ t('auth.createAccount') }}</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>