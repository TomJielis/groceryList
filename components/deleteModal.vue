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
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4" @click.self="handleClose">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isVisible" class="bg-[#18181b] rounded max-w-md w-full border border-[#27272a] overflow-hidden" @click.stop>
          <!-- Header -->
          <div class="bg-[#18181b] border-b border-[#27272a] px-6 py-4">
            <div class="flex items-center gap-4">
              <!-- Close Button -->
              <button
                @click="handleClose"
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors active:scale-95"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Title -->
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-medium text-[#fafafa] truncate">
                  {{ title }}
                </h1>
                <p v-if="itemName" class="text-sm text-[#71717a] truncate">
                  {{ itemName }}
                </p>
              </div>

              <!-- Delete Icon -->
              <div class="flex-shrink-0 w-10 h-10 bg-red-900/40 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 bg-[#18181b]">
            <p class="text-[#71717a] text-sm mb-4">
              {{ content }}
            </p>

            <div v-if="withValidation">
              <p class="text-sm text-[#71717a] mb-2">
                {{ i18n.t('deleteModal.typeListNameToDelete') }}
              </p>
              <p class="text-base font-medium text-red-400 mb-3">
                {{ itemName }}
              </p>
              <input
                v-model="confirmText"
                type="text"
                :placeholder="itemName"
                class="w-full py-2 border-b border-[#27272a] focus:border-[#52525b] bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] outline-none transition text-base"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-[#18181b] border-t border-[#27272a] px-6 py-4">
            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-3 border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] font-medium rounded transition-colors active:scale-95"
              >
                {{ i18n.t('common.cancel') }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="!isDeleteEnabled"
                class="flex-1 px-4 py-3 border border-red-800 text-red-400 bg-red-900/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed font-medium rounded transition-all active:scale-95"
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
