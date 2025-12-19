<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useI18nStore } from "~/stores/i18n";
import { useNotification } from '~/composables/useNotification';

const authStore = useAuthStore();
const i18n = useI18nStore();
const { showSuccess, showNotification } = useNotification();
const t = computed(() => i18n.t);
const isDarkMode = ref(false);

onMounted(() => {
  // Explicitly default to light mode (false) unless user has dark_mode set to true
  isDarkMode.value = authStore.user?.dark_mode === true;
});

// Watch for changes in authStore.user.dark_mode
watch(() => authStore.user?.dark_mode, (newValue) => {
  if (newValue !== undefined && newValue !== null) {
    isDarkMode.value = newValue;
  }
});

async function toggleDarkMode() {
  const newValue = !isDarkMode.value;
  isDarkMode.value = newValue;

  // Update DOM and localStorage immediately
  if (newValue) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', newValue ? '#0f172a' : '#ffffff');
  }

  // Update auth store FIRST
  authStore.setDarkMode(newValue);

  // Save to database
  try {
    await $fetch('/api/user/theme', {
      method: 'POST',
      body: JSON.stringify(newValue)
    });

    showSuccess(newValue ?
        (t.value('profile.darkModeEnabled') || 'Donkere modus ingeschakeld') :
        (t.value('profile.lightModeEnabled') || 'Lichte modus ingeschakeld')
    );
  } catch (error) {
    console.error('Failed to save theme preference:', error);
    showNotification(t.value('errors.themeSaveFailed') || 'Kon thema voorkeur niet opslaan');
  }
}

</script>

<template>
  <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        {{ i18n.t('profile.theme') || 'Thema' }}
      </h2>
    </div>
  </div>
  <div class="p-6">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-1">
          {{ i18n.t('profile.darkMode') || 'Donkere modus' }}
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          {{ i18n.t('profile.darkModeDescription') || 'Schakel tussen lichte en donkere weergave' }}
        </p>
      </div>
      <button
          @click="toggleDarkMode"
          class="relative inline-flex items-center h-8 w-14 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          :class="isDarkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'"
          role="switch"
          :aria-checked="isDarkMode"
      >
        <span class="sr-only">Toggle dark mode</span>
        <span
            class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform"
            :class="isDarkMode ? 'translate-x-7' : 'translate-x-1'"
        >
                  <svg v-if="isDarkMode" class="w-6 h-6 p-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                  <svg v-else class="w-6 h-6 p-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                  </svg>
                </span>
      </button>
    </div>
  </div>
</template>
