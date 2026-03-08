<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { ref, computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  title: string;
  content: string;
  itemName?: string;
  deleteButtonText?: string;
  withValidation?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const i18n = useI18nStore();

const confirmText = ref('');
const isDeleteEnabled = computed(() => {
  if (!props.withValidation) return true;
  return confirmText.value.trim() === props.itemName;
});

function handleClose() {
  confirmText.value = '';
  emit('close');
}

function handleConfirm() {
  confirmText.value = '';
  emit('confirm');
}

</script>

<template>

  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 backdrop-blur-sm" @click.self="handleClose">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isVisible" class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" @click.stop>
          <!-- Header -->
          <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <div class="flex items-center gap-4">
              <!-- Close Button -->
              <button
                @click="handleClose"
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-95"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Title -->
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-bold text-slate-900 dark:text-white truncate">
                  {{ title }}
                </h1>
                <p v-if="itemName" class="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {{ itemName }}
                </p>
              </div>

              <!-- Delete Icon -->
              <div class="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 bg-slate-50 dark:bg-slate-900">
            <p class="text-slate-600 dark:text-slate-400 mb-4">
              {{ content }}
            </p>

            <div v-if="withValidation">
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-2 px-1">
                {{ i18n.t('deleteModal.typeListNameToDelete') }}
              </p>
              <p class="text-base font-bold text-red-600 dark:text-red-400 mb-3 px-1">
                {{ itemName }}
              </p>
              <input
                v-model="confirmText"
                type="text"
                :placeholder="itemName"
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-95"
              >
                {{ i18n.t('common.cancel') }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="!isDeleteEnabled"
                class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95"
              >
                {{ deleteButtonText || i18n.t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
