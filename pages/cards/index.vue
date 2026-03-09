<script setup lang="ts">
import cardsComponent from "~/components/dashboard/cards.vue";
import { useI18nStore } from '~/stores/i18n';

definePageMeta({
  middleware: ['auth', 'terms'],
});

const i18n = useI18nStore();
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm touch-none">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <!-- Title & Stats -->
          <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {{ i18n.t('cards.available') || 'Mijn Kaarten' }}
            </h1>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ i18n.t('cards.manageYourCards') || 'Beheer je kortingskaarten' }}</span>
            </div>
          </div>

          <!-- Upload Button -->
          <NuxtLink
            to="/cards/upload"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="max-w-6xl mx-auto px-4 pb-24 pt-4">
        <cardsComponent/>
      </div>
    </div>
  </div>
</template>