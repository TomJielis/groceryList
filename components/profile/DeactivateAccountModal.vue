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
  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 backdrop-blur-sm overflow-hidden" @click.self="handleClose" @touchmove.prevent>
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isVisible" class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh]" @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="text-xl font-bold text-white">
                  {{ i18n.t('profile.deactivateAccountTitle') || 'Account deactiveren' }}
                </h3>
              </div>
              <button
                @click="handleClose"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Warning Message -->
            <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
              <div class="flex gap-3">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                  <p class="font-semibold text-red-900 dark:text-red-100 mb-1">
                    {{ i18n.t('profile.permanentAction') || 'Dit is een permanente actie' }}
                  </p>
                  <p class="text-sm text-red-700 dark:text-red-300">
                    {{ i18n.t('profile.deactivateAccountWarning') || 'Al je gegevens, lijsten en kaarten worden permanent verwijderd.' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Confirmation Instructions -->
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {{ i18n.t('profile.deactivateAccountConfirm') || 'Typ DELETE om te bevestigen' }}
            </p>

            <!-- Confirmation Input -->
            <div class="mb-6">
              <input
                :value="confirmText"
                @input="updateConfirmText"
                type="text"
                :placeholder="i18n.t('profile.typeDELETE') || 'DELETE'"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                @keyup.enter="confirmText === 'DELETE' && handleConfirm()"
              />
              <p v-if="confirmText && confirmText !== 'DELETE'" class="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ i18n.t('profile.typeDELETEExact') || 'Type exact "DELETE" (hoofdletters)' }}</span>
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-98 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span>{{ i18n.t('common.cancel') || 'Annuleren' }}</span>
              </button>
              <button
                @click="handleConfirm"
                :disabled="confirmText !== 'DELETE'"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>{{ i18n.t('profile.deactivateAccount') || 'Account deactiveren' }}</span>
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

