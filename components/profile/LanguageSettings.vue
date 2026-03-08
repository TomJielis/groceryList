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
      class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
      :class="i18n.locale === 'nl'
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
    >
      <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-xl">
        🇳🇱
      </div>
      <div class="flex-1">
        <p class="font-semibold text-slate-900 dark:text-white">{{ i18n.t('nav.dutch') }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'nl'"
        @change="handleLanguageChange('nl')"
        class="sr-only"
      />
      <div v-if="i18n.locale === 'nl'" class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    </label>

    <!-- English Option -->
    <label
      class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
      :class="i18n.locale === 'en'
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'"
    >
      <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xl">
        🇬🇧
      </div>
      <div class="flex-1">
        <p class="font-semibold text-slate-900 dark:text-white">{{ i18n.t('nav.english') }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'en'"
        @change="handleLanguageChange('en')"
        class="sr-only"
      />
      <div v-if="i18n.locale === 'en'" class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    </label>
  </div>
</template>
