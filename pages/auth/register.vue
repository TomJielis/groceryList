<script setup lang="ts">
import {ref, watch} from 'vue';
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
  <div class="h-[90dvh] flex items-center justify-center px-4">
    <div
        class="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-border-light dark:border-border-dark">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-primary-dark dark:text-accent-light">
        📝 {{ i18n.t('auth.registerTitle') }}
      </h2>
      <div v-if="!verifyMailMessage">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{
                i18n.t('auth.name')
              }}</label>
            <input
                type="text"
                id="name"
                v-model="userData.name"
                class="block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 text-base transition-colors"
                :placeholder="i18n.t('auth.name')"
                required
            />
          </div>
          <div class="relative">
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{ i18n.t('auth.email') }}</label>
            <input
                type="email"
                id="email"
                :disabled="isEmailDisabled"
                v-model="userData.email"
                :class="[
                  'block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 text-base transition-colors',
                  isEmailDisabled ? 'bg-gray-100 dark:bg-slate-800 cursor-not-allowed pr-10' : 'bg-white/80 dark:bg-slate-900/80'
                ]"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                required
            />
            <span
                v-if="isEmailDisabled"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
            >
            </span>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{
                i18n.t('auth.password')
              }}</label>
            <input
                type="password"
                id="password"
                v-model="userData.password"
                class="block w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl shadow focus:ring-2 focus:ring-accent focus:border-accent placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80 text-base transition-colors"
                :placeholder="i18n.t('auth.password')"
                required
            />
          </div>
          <div
              class="bg-white/80 dark:bg-slate-900/80 rounded-xl shadow p-4 border border-border-light dark:border-border-dark">
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    type="radio"
                    class="accent-accent w-5 h-5 rounded-full border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent"
                    name="language"
                    value="nl"
                    v-model="userData.language"
                    @change="handleLanguageChange('nl')"
                />
                <span class="text-base text-slate-700 dark:text-slate-100 font-medium">🇳🇱 {{
                    i18n.t('nav.dutch')
                  }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                    type="radio"
                    class="accent-accent w-5 h-5 rounded-full border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent"
                    name="language"
                    value="en"
                    v-model="userData.language"
                    @change="handleLanguageChange('en')"
                />
                <span class="text-base text-slate-700 dark:text-slate-100 font-medium">🇺🇸 {{
                    i18n.t('nav.english')
                  }}</span>
              </label>
            </div>
          </div>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="userData.acceptedTerms" required />
            <span v-html="i18n.t('register.acceptTerms')"></span>
          </label>
          <button type="submit"
                  class="w-full bg-accent text-white py-3 rounded-xl hover:bg-accent-dark active:scale-95 transition font-semibold shadow border border-accent/80 focus:ring-2 focus:ring-accent">
            {{ i18n.t('auth.registerBtn') }}
          </button>
        </form>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-accent-light">
          {{ i18n.t('auth.verifyMailMessageTitle') }}
        </h2>
        <p class="text-sm text-slate-700 dark:text-slate-300">
          {{ i18n.t('auth.verifyMailMessageBody') }}
        </p>
      </div>
    </div>
  </div>
</template>
