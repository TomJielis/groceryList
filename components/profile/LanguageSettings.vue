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
  <div class="space-y-2">
    <!-- Dutch Option -->
    <label
      class="flex items-center gap-4 p-4 border cursor-pointer transition-colors rounded"
      :class="i18n.locale === 'nl'
        ? 'border-[#27272a] bg-[#1e1e21]'
        : 'border-[#27272a] bg-transparent hover:border-[#3f3f46]'"
    >
      <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
        🇳🇱
      </div>
      <div class="flex-1">
        <p class="font-medium text-[#fafafa]">{{ i18n.t('nav.dutch') }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'nl'"
        @change="handleLanguageChange('nl')"
        class="sr-only"
      />
      <svg v-if="i18n.locale === 'nl'" class="w-4 h-4 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
    </label>

    <!-- English Option -->
    <label
      class="flex items-center gap-4 p-4 border cursor-pointer transition-colors rounded"
      :class="i18n.locale === 'en'
        ? 'border-[#27272a] bg-[#1e1e21]'
        : 'border-[#27272a] bg-transparent hover:border-[#3f3f46]'"
    >
      <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
        🇬🇧
      </div>
      <div class="flex-1">
        <p class="font-medium text-[#fafafa]">{{ i18n.t('nav.english') }}</p>
      </div>
      <input
        type="radio"
        :checked="i18n.locale === 'en'"
        @change="handleLanguageChange('en')"
        class="sr-only"
      />
      <svg v-if="i18n.locale === 'en'" class="w-4 h-4 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
    </label>
  </div>
</template>
