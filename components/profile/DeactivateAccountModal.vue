<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

defineProps<{
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
  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 overflow-hidden" @click.self="handleClose" @touchmove.prevent>
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isVisible" class="bg-[#18181b] border border-[#27272a] rounded max-w-md w-full overflow-hidden max-h-[90vh]" @click.stop>
          <!-- Header -->
          <div class="border-b border-[#27272a] px-6 py-4">
            <div class="flex items-center gap-4">
              <!-- Close Button -->
              <button
                @click="handleClose"
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#71717a] hover:text-[#a1a1aa] transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Title -->
              <div class="flex-1 min-w-0">
                <h1 class="text-[1.1rem] font-medium text-[#fafafa] truncate">
                  {{ i18n.t('profile.deactivateAccountTitle') }}
                </h1>
              </div>

              <!-- Warning Icon -->
              <div class="flex-shrink-0 text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-4">
            <!-- Warning Message -->
            <div class="p-4 border border-red-800 bg-red-900/40 rounded">
              <p class="font-medium text-red-400 mb-1">
                {{ i18n.t('profile.permanentAction') }}
              </p>
              <p class="text-sm text-red-400/80">
                {{ i18n.t('profile.deactivateAccountWarning') }}
              </p>
            </div>

            <!-- Confirmation Instructions -->
            <p class="text-sm text-[#a1a1aa]">
              {{ i18n.t('profile.deactivateAccountConfirm') }}
            </p>
            <p class="text-base font-medium text-red-400">DELETE</p>

            <!-- Confirmation Input -->
            <input
              :value="confirmText"
              @input="updateConfirmText"
              type="text"
              placeholder="DELETE"
              class="w-full pb-2 border-b border-[#27272a] focus:border-[#52525b] bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] outline-none text-base transition-colors"
              @keyup.enter="confirmText === 'DELETE' && handleConfirm()"
            />
          </div>

          <!-- Footer -->
          <div class="border-t border-[#27272a] px-6 py-4">
            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-2.5 border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] font-medium rounded transition-colors"
              >
                {{ i18n.t('common.cancel') }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="confirmText !== 'DELETE'"
                class="flex-1 px-4 py-2.5 border border-red-800 text-red-400 bg-red-900/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed font-medium rounded transition-colors"
              >
                {{ i18n.t('profile.deactivateAccount') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Prevent scrolling on modal backdrop */
.fixed.inset-0 {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
</style>

