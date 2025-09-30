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
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold mb-4">{{ i18n.t('profile.language') }}</h2>
    <div class="space-y-3">
      <label class="flex items-center">
        <input
          type="radio"
          :checked="i18n.locale === 'nl'"
          @change="handleLanguageChange('nl')"
          class="mr-3"
        />
        <span>🇳🇱 {{ i18n.t('nav.dutch') }}</span>
      </label>
      <label class="flex items-center">
        <input
          type="radio"
          :checked="i18n.locale === 'en'"
          @change="handleLanguageChange('en')"
          class="mr-3"
        />
        <span>🇺🇸 {{ i18n.t('nav.english') }}</span>
      </label>
    </div>
  </div>
</template>
