<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

const props = defineProps<{
  isVisible: boolean;
  confirmText: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'update:confirmText', value: string): void;
}>();

const i18n = useI18nStore();

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}

function updateConfirmText(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:confirmText', target.value);
}
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border-light dark:border-border-dark">
      <h3 class="text-lg font-bold text-error mb-4">{{ i18n.t('profile.deactivateAccountTitle') }}</h3>
      <p class="text-slate-700 dark:text-slate-200 mb-4">{{ i18n.t('profile.deactivateAccountWarning') }}</p>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">{{ i18n.t('profile.deactivateAccountConfirm') }}</p>


      <input
        :value="confirmText"
        @input="updateConfirmText"
        type="text"
        :placeholder="i18n.t('profile.typeDELETE')"
        class="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-error focus:border-error text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500 mb-4"
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
          :disabled="confirmText !== 'DELETE'"
          class="flex-1 bg-error py-2 px-4 rounded-xl hover:bg-error/90 transition shadow border border-error/80 font-semibold focus:ring-2 focus:ring-error"        >
          {{ i18n.t('profile.deactivateAccount') }}
        </button>
      </div>
    </div>
  </div>
</template>
