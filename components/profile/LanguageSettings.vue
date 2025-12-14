<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

const emit = defineEmits<{
  (e: 'languageChange', locale: 'nl' | 'en'): void;
}>();

const i18n = useI18nStore();

function handleLanguageChange(locale: 'nl' | 'en') {
  emit('languageChange', locale);
}
</script>

<template>
  <div class="space-y-3">
    <!-- Dutch Option -->
    <label
      class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 cursor-pointer transition-all"
      :class="i18n.locale === 'nl'
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
    >
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center text-2xl">
        🇳🇱
      </div>
      <div class="flex-1">
        <p class="font-bold text-slate-900 dark:text-white">{{ i18n.t('nav.dutch') || 'Nederlands' }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ i18n.t('profile.primaryLanguage') || 'Primaire taal' }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'nl'"
        @change="handleLanguageChange('nl')"
        class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
    </label>

    <!-- English Option -->
    <label
      class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 cursor-pointer transition-all"
      :class="i18n.locale === 'en'
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
    >
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30 flex items-center justify-center text-2xl">
        🇺🇸
      </div>
      <div class="flex-1">
        <p class="font-bold text-slate-900 dark:text-white">{{ i18n.t('nav.english') || 'English' }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ i18n.t('profile.secondaryLanguage') || 'Secondary language' }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'en'"
        @change="handleLanguageChange('en')"
        class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
    </label>
  </div>
</template>
