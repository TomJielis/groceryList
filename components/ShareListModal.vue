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
  <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border-light dark:border-border-dark">
      <h3 class="text-lg font-bold text-accent mb-4 flex items-center gap-2">
        👥 {{ i18n.t('lists.shareTitle') }}
      </h3>
      <p v-if="listName" class="text-slate-700 dark:text-slate-200 mb-2">
        {{ i18n.t('lists.shareListName') }}: <span class="font-semibold">{{ listName }}</span>
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4">{{ i18n.t('lists.sharePrompt') }}</p>
      <input
        :value="email"
        @input="updateEmail"
        type="email"
        :placeholder="i18n.t('lists.shareEmailPlaceholder')"
        class="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-accent focus:border-accent text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500 mb-4"
      />
      <div class="flex space-x-3">
        <button
          @click="handleClose"
          class="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-100 py-2 px-4 rounded-xl hover:bg-accent/10 dark:hover:bg-accent/20 transition shadow border border-border-light dark:border-border-dark font-medium"
        >
          {{ i18n.t('common.cancel') }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="!isValidEmail(email)"
          class="flex-1 bg-accent text-white py-2 px-4 rounded-xl hover:bg-accent-dark transition shadow border border-accent/80 font-semibold focus:ring-2 focus:ring-accent disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ i18n.t('lists.shareBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>
