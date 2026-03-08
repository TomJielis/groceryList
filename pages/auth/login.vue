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
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-16 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <span class="text-4xl">🛒</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ t('nav.login') }}</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email Input -->
            <div>
              <label for="email" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                {{ t('auth.email') }}
              </label>
              <input
                type="email"
                id="email"
                v-model="userData.email"
                :placeholder="t('auth.emailPlaceholder')"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                {{ t('auth.password') }}
              </label>
              <input
                type="password"
                id="password"
                v-model="userData.password"
                :placeholder="t('auth.passwordPlaceholder')"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95 mt-6"
            >
              {{ t('auth.loginBtn') }}
            </button>
          </form>

          <!-- Links -->
          <div class="mt-6 space-y-3">
            <NuxtLink
              to="/auth/password/reset"
              class="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {{ t('auth.forgotPassword') }}
            </NuxtLink>

            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="px-2 bg-white dark:bg-slate-800 text-slate-400">{{ t('auth.or') }}</span>
              </div>
            </div>

            <NuxtLink
              to="/auth/register"
              class="block text-center py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              {{ t('auth.createAccount') }}
            </NuxtLink>
          </div>

          <!-- Language Toggle -->
          <div class="mt-6 flex justify-center">
            <button
              @click="toggleLanguage"
              type="button"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>{{ i18n.locale === 'en' ? '🇳🇱 Nederlands' : '🇬🇧 English' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>