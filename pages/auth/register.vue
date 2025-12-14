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
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <span class="text-4xl">📝</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ i18n.t('auth.registerTitle') || 'Registreren' }}</h1>
          <p class="text-blue-100 text-sm">{{ i18n.t('auth.registerSubtitle') || 'Maak een gratis account aan' }}</p>
        </div>

        <!-- Form / Success Message -->
        <div class="p-6">
          <div v-if="!verifyMailMessage">
            <form @submit.prevent="handleRegister" class="space-y-4">
              <!-- Name Input -->
              <div>
                <label for="name" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.name') || 'Naam' }}
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="userData.name"
                  :placeholder="i18n.t('auth.namePlaceholder') || 'Je naam'"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Email Input -->
              <div>
                <label for="email" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.email') || 'Email' }}
                </label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    :disabled="isEmailDisabled"
                    v-model="userData.email"
                    :placeholder="i18n.t('auth.emailPlaceholder') || 'je@email.nl'"
                    required
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400',
                      isEmailDisabled
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    ]"
                  />
                  <svg v-if="isEmailDisabled" class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('auth.password') || 'Wachtwoord' }}
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="userData.password"
                  :placeholder="i18n.t('auth.passwordPlaceholder') || '••••••••'"
                  required
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <!-- Language Selector - Only visible on desktop -->
              <div class="hidden md:block">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {{ i18n.t('profile.language') || 'Taal' }}
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label
                    class="relative flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 cursor-pointer transition-all"
                    :class="userData.language === 'nl' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
                  >
                    <input
                      type="radio"
                      class="w-5 h-5 text-blue-600"
                      name="language"
                      value="nl"
                      v-model="userData.language"
                      @change="handleLanguageChange('nl')"
                    />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">🇳🇱 {{ i18n.t('nav.dutch') }}</span>
                  </label>
                  <label
                    class="relative flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 cursor-pointer transition-all"
                    :class="userData.language === 'en' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
                  >
                    <input
                      type="radio"
                      class="w-5 h-5 text-blue-600"
                      name="language"
                      value="en"
                      v-model="userData.language"
                      @change="handleLanguageChange('en')"
                    />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">🇺🇸 {{ i18n.t('nav.english') }}</span>
                  </label>
                </div>
              </div>

              <!-- Terms Checkbox -->
              <label
                class="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 cursor-pointer transition-all"
                :class="userData.acceptedTerms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
              >
                <input
                  type="checkbox"
                  v-model="userData.acceptedTerms"
                  required
                  class="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span class="text-sm text-slate-700 dark:text-slate-300 accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
              </label>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span>{{ i18n.t('auth.registerBtn') || 'Account aanmaken' }}</span>
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div v-else class="text-center space-y-6 py-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {{ i18n.t('auth.verifyMailMessageTitle') || 'Controleer je email' }}
              </h2>
              <p class="text-slate-600 dark:text-slate-400">
                {{ i18n.t('auth.verifyMailMessageBody') || 'We hebben een verificatie email gestuurd. Klik op de link in de email om je account te activeren.' }}
              </p>
            </div>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>{{ i18n.t('auth.backToLogin') || 'Terug naar inloggen' }}</span>
            </NuxtLink>
          </div>

          <!-- Login Link -->
          <div v-if="!verifyMailMessage" class="mt-6 text-center">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              {{ i18n.t('auth.alreadyHaveAccount') || 'Heb je al een account?' }}
              <NuxtLink to="/auth/login" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                {{ i18n.t('nav.login') || 'Inloggen' }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.accept-terms-link) a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  font-weight: 600;
}
:deep(.accept-terms-link) a:hover {
  color: #1d4ed8;
}
</style>
