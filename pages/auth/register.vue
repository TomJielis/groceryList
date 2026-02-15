<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useNotification} from "~/composables/useNotification";
import {useI18nStore} from '~/stores/i18n';
import {useRoute} from 'vue-router';

const route = useRoute();
const i18n = useI18nStore();
const {showNotification} = useNotification();
const {register} = useAuth();

const emailFromUrl = route.query.email as string | undefined;
const isEmailDisabled = computed(() => !!emailFromUrl);
const userData = ref({
  name: '',
  email: emailFromUrl ? emailFromUrl : '',
  password: '',
  language: i18n.locale,
  acceptedTerms: false,
});

const verifyMailMessage = ref(false);

function handleRegister() {
  const registrationData = {
    ...userData.value,
    language: i18n.locale
  };

  register(registrationData)
      .then(() => {
        verifyMailMessage.value = true;
      })
      .catch((error) => {
        verifyMailMessage.value = false;
        showNotification(error);
      });
}

watch(() => i18n.locale, (newLocale) => {
  userData.value.language = newLocale;
});

function handleLanguageChange(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
  userData.value.language = locale;
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
            <span class="text-4xl">📝</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ i18n.t('auth.registerTitle') }}</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ i18n.t('auth.registerSubtitle') }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!verifyMailMessage">
            <form @submit.prevent="handleRegister" class="space-y-4">
              <div>
                <label for="name" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.name') }}
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="userData.name"
                  :placeholder="i18n.t('auth.namePlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Email Input -->
              <div>
                <label for="email" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.email') }}
                </label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    :disabled="isEmailDisabled"
                    v-model="userData.email"
                    :placeholder="i18n.t('auth.emailPlaceholder')"
                    required
                    :class="[
                      'w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400',
                      isEmailDisabled
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    ]"
                  />
                  <svg v-if="isEmailDisabled" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <label for="password" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('auth.password') }}
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="userData.password"
                  :placeholder="i18n.t('auth.passwordPlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Language Selector -->
              <div>
                <label class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                  {{ i18n.t('profile.language') }}
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label
                    class="relative flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
                    :class="userData.language === 'nl' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
                  >
                    <input
                      type="radio"
                      class="sr-only"
                      name="language"
                      value="nl"
                      v-model="userData.language"
                      @change="handleLanguageChange('nl')"
                    />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">🇳🇱 {{ i18n.t('nav.dutch') }}</span>
                  </label>
                  <label
                    class="relative flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
                    :class="userData.language === 'en' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
                  >
                    <input
                      type="radio"
                      class="sr-only"
                      name="language"
                      value="en"
                      v-model="userData.language"
                      @change="handleLanguageChange('en')"
                    />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">🇬🇧 {{ i18n.t('nav.english') }}</span>
                  </label>
                </div>
              </div>

              <!-- Terms Checkbox -->
              <label
                class="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
                :class="userData.acceptedTerms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
              >
                <input
                  type="checkbox"
                  v-model="userData.acceptedTerms"
                  required
                  class="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span class="text-sm text-slate-600 dark:text-slate-400 accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
              </label>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95 mt-6"
              >
                {{ i18n.t('auth.registerBtn') }}
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {{ i18n.t('auth.verifyMailMessageTitle') }}
              </h2>
              <p class="text-slate-500 dark:text-slate-400 text-sm">
                {{ i18n.t('auth.verifyMailMessageBody') }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              {{ i18n.t('auth.backToLogin') }}
            </NuxtLink>
          </div>

          <!-- Login Link -->
          <div v-if="!verifyMailMessage" class="mt-6 text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ i18n.t('auth.alreadyHaveAccount') }}
              <NuxtLink to="/auth/login" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                {{ i18n.t('nav.login') }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
