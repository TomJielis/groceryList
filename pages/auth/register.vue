<script setup lang="ts">
import { ref, watch } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useRouter} from "vue-router";
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';

const i18n = useI18nStore();
const { showNotification } = useNotification();
const { register } = useAuth();
const router = useRouter();
const userData = ref({
  name: '',
  email: '',
  password: '',
  language: i18n.locale // Initialize with current language
});

const verifyMailMessage = ref(false);

function handleRegister() {
  // Include the current language selection in the registration data
  const registrationData = {
    ...userData.value,
    language: i18n.locale // Add current language to registration
  };

  register(registrationData)
      .then((data) => {
        verifyMailMessage.value = true;
      })
      .catch((error) => {
        verifyMailMessage.value = false;
        showNotification(error);
      });
}

// Watch for language changes and update the form
watch(() => i18n.locale, (newLocale) => {
  userData.value.language = newLocale;
});

// Handle language change in registration form
function handleLanguageChange(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
  userData.value.language = locale;
}
</script>

<template>
  <div class="h-[90vh] flex items-center justify-center px-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">
        📝 {{ i18n.t('auth.registerTitle') }}
      </h2>
      <div v-if="!verifyMailMessage">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.name') }}</label>
            <input
                type="text"
                id="name"
                v-model="userData.name"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.name')"
                required
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.email') }}</label>
            <input
                type="email"
                id="email"
                v-model="userData.email"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.emailPlaceholder')"
                required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.password') }}</label>
            <input
                type="password"
                id="password"
                v-model="userData.password"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                :placeholder="i18n.t('auth.password')"
                required
            />
          </div>
          <div class="bg-white rounded-xl shadow-sm">
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                    type="radio"
                    class="mr-3"
                    name="language"
                    value="nl"
                    v-model="userData.language"
                    @change="handleLanguageChange('nl')"
                />
                <span>🇳🇱 {{ i18n.t('nav.dutch') }}</span>
              </label>
              <label class="flex items-center">
                <input
                    type="radio"
                    class="mr-3"
                    name="language"
                    value="en"
                    v-model="userData.language"
                    @change="handleLanguageChange('en')"
                />
                <span>🇺🇸 {{ i18n.t('nav.english') }}</span>
              </label>
            </div>
          </div>
          <button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold">
            {{ i18n.t('auth.registerBtn') }}
          </button>
        </form>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {{ i18n.t('auth.verifyMailMessageTitle') }}
        </h2>
        <p class="text-sm text-gray-700">
          {{ i18n.t('auth.verifyMailMessageBody') }}
        </p>
      </div>
    </div>
  </div>
</template>
