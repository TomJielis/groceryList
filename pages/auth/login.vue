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
  <div class="fixed inset-0 md:pt-16 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-8 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <span class="text-4xl">🛒</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ t('nav.login') || 'Inloggen' }}</h1>
          <p class="text-blue-100 text-sm">{{ t('auth.loginSubtitle') || 'Welkom terug bij Grocerylist' }}</p>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ t('auth.email') || 'Email' }}
              </label>
              <input
                type="email"
                id="email"
                v-model="userData.email"
                :placeholder="t('auth.emailPlaceholder') || 'je@email.nl'"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ t('auth.password') || 'Wachtwoord' }}
              </label>
              <input
                type="password"
                id="password"
                v-model="userData.password"
                :placeholder="t('auth.passwordPlaceholder') || '••••••••'"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span>{{ t('auth.loginBtn') || 'Inloggen' }}</span>
            </button>
          </form>

          <!-- Links -->
          <div class="mt-6 space-y-3">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{{ t('auth.or') || 'Of' }}</span>
              </div>
            </div>

            <NuxtLink
              to="/auth/password/reset"
              class="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {{ t('auth.forgotPassword') || 'Wachtwoord vergeten?' }}
            </NuxtLink>

            <NuxtLink
              to="/auth/register"
              class="block text-center py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              {{ t('auth.createAccount') || 'Account aanmaken' }}
            </NuxtLink>
          </div>

          <!-- Language Toggle -->
          <div class="mt-6 flex justify-center">
            <button
              @click="toggleLanguage"
              type="button"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
              </svg>
              <span>{{ i18n.locale === 'en' ? 'Nederlands' : 'English' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>