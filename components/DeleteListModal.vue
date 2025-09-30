<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

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
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 class="text-lg font-bold text-red-600 mb-4">
        🗑️ {{ itemType === 'list' ? i18n.t('lists.deleteTitle') : i18n.t('cards.deleteTitle') }}
      </h3>

      <p v-if="itemName" class="text-gray-700 mb-2">
        {{ itemType === 'list' ? i18n.t('lists.deleteListName') : i18n.t('cards.deleteCardName') }}: <span class="font-semibold">{{ itemName }}</span>
      </p>

      <p class="text-gray-700 mb-6">
        {{ itemType === 'list' ? i18n.t('lists.confirmDelete') : i18n.t('cards.confirmDelete') }}
      </p>

      <div class="flex space-x-3">
        <button
          @click="handleClose"
          class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
        >
          {{ i18n.t('common.cancel') }}
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          {{ itemType === 'list' ? i18n.t('lists.deleteBtn') : i18n.t('cards.deleteBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>
