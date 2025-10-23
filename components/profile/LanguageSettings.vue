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
    <h2 class="text-lg font-bold text-primary-dark dark:text-accent-light mb-4">{{ i18n.t('profile.language') }}</h2>
    <div class="space-y-3">
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          :checked="i18n.locale === 'nl'"
          @change="handleLanguageChange('nl')"
          class="accent-accent w-5 h-5 rounded-full border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent"
        />
        <span class="text-base text-slate-700 dark:text-slate-100 font-medium">🇳🇱 {{ i18n.t('nav.dutch') }}</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          :checked="i18n.locale === 'en'"
          @change="handleLanguageChange('en')"
          class="accent-accent w-5 h-5 rounded-full border border-border-light dark:border-border-dark focus:ring-2 focus:ring-accent"
        />
        <span class="text-base text-slate-700 dark:text-slate-100 font-medium">🇺🇸 {{ i18n.t('nav.english') }}</span>
      </label>
    </div>
</template>
