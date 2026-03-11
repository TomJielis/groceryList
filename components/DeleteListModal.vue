<script setup lang="ts">
import {useI18nStore} from '~/stores/i18n';

defineProps<{
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
  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[99999] p-0 sm:p-4" @click.self="handleClose">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="isVisible" class="bg-[#18181b] border border-[#27272a] rounded-t sm:rounded max-w-md w-full overflow-hidden" style="font-family: 'DM Sans', system-ui, sans-serif;" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
            <div class="min-w-0">
              <h2 class="text-base font-medium text-[#fafafa] truncate">
                {{ itemType === 'list' ? i18n.t('lists.deleteTitle') : i18n.t('cards.deleteTitle') }}
              </h2>
              <p v-if="itemName" class="text-sm text-[#71717a] truncate mt-0.5">{{ itemName }}</p>
            </div>
            <button
              @click="handleClose"
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#52525b] hover:text-[#a1a1aa] transition-colors ml-4"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4">
            <p class="text-sm text-[#71717a]">
              {{ itemType === 'list' ? i18n.t('lists.confirmDelete') : i18n.t('cards.confirmDelete') }}
            </p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-[#27272a] flex gap-2">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2.5 border border-[#27272a] hover:border-[#52525b] text-[#71717a] hover:text-[#a1a1aa] font-medium rounded transition active:scale-95 text-sm"
            >
              {{ i18n.t('common.cancel') }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-2.5 bg-red-900/40 border border-red-800 text-red-400 hover:bg-red-900/60 font-medium rounded transition active:scale-95 text-sm"
            >
              {{ itemType === 'list' ? i18n.t('lists.deleteBtn') : i18n.t('cards.deleteBtn') }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
