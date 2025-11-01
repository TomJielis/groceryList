<script setup lang="ts">
import {useI18nStore} from '~/stores/i18n';

const props = defineProps<{
  isVisible: boolean;
  itemName?: string;
  itemType: 'list' | 'card';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const i18n = useI18nStore();

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}
</script>

<template>
  <!-- TODO: refactor this file, so i can sent the translation tags from the parent component -->
  <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border-light dark:border-border-dark">
      <h3 class="text-lg font-bold text-error mb-4 flex items-center gap-2">
        🗑️ {{ itemType === 'list' ? i18n.t('lists.deleteTitle') : i18n.t('cards.deleteTitle') }}
      </h3>

      <p v-if="itemName" class="text-slate-700 dark:text-slate-200 mb-2">
        {{ itemType === 'list' ? i18n.t('lists.deleteListName') : i18n.t('cards.deleteCardName') }}: <span
          class="font-semibold">{{ itemName }}</span>
      </p>

      <p class="text-slate-600 dark:text-slate-400 mb-6">
        {{ itemType === 'list' ? i18n.t('lists.confirmDelete') : i18n.t('cards.confirmDelete') }}
      </p>

      <!-- TODO: add those buttons as a component. since they are being used on multiple places with the same styling -->
      <div class="flex space-x-3">
        <button
            @click="handleClose"
            class="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-100 py-2 px-4 rounded-xl hover:bg-accent/10 dark:hover:bg-accent/20 transition shadow border border-border-light dark:border-border-dark font-medium"
        >
          {{ i18n.t('common.cancel') }}
        </button>
        <button
            @click="handleConfirm"
            class="flex-1 bg-error  py-2 px-4 rounded-xl hover:bg-error/90 transition shadow border border-error/80 font-semibold focus:ring-2 focus:ring-error"        >
          {{ itemType === 'list' ? i18n.t('lists.deleteBtn') : i18n.t('cards.deleteBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>
