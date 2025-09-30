<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

const props = defineProps<{
  isVisible: boolean;
  email: string;
  listName?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', email: string): void;
  (e: 'update:email', value: string): void;
}>();

const i18n = useI18nStore();

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm', props.email);
}

function updateEmail(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:email', target.value);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 class="text-lg font-bold text-blue-600 mb-4">
        👥 {{ i18n.t('lists.shareTitle') }}
      </h3>

      <p v-if="listName" class="text-gray-700 mb-2">
        {{ i18n.t('lists.shareListName') }}: <span class="font-semibold">{{ listName }}</span>
      </p>

      <p class="text-gray-700 mb-4">{{ i18n.t('lists.sharePrompt') }}</p>

      <input
        :value="email"
        @input="updateEmail"
        type="email"
        :placeholder="i18n.t('auth.emailPlaceholder')"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />

      <div class="flex space-x-3">
        <button
          @click="handleClose"
          class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
        >
          {{ i18n.t('common.cancel') }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="!email.trim() || !isValidEmail(email)"
          class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ i18n.t('lists.shareBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>
