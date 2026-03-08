<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { watch, onUnmounted } from 'vue';

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

// Prevent body scroll when modal is open
watch(() => props.isVisible, (isVisible) => {
  if (import.meta.client) {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});

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

// Prevent touch scroll on backdrop
function preventScroll(event: TouchEvent) {
  event.preventDefault();
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
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 backdrop-blur-sm overflow-hidden overscroll-none touch-none" @click.self="handleClose" @touchmove.prevent>
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
                  {{ i18n.t('lists.shareTitle') }}
                </h1>
                <p v-if="listName" class="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {{ listName }}
                </p>
              </div>

              <!-- Share Icon -->
              <div class="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 bg-slate-50 dark:bg-slate-900">
            <!-- Instructions -->
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {{ i18n.t('lists.sharePrompt') }}
            </p>

            <!-- Email Input -->
            <div class="mb-6">
              <label class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">
                {{ i18n.t('lists.emailAddress') || 'E-mailadres' }}
              </label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  :value="email"
                  @input="updateEmail"
                  type="email"
                  :placeholder="i18n.t('lists.shareEmailPlaceholder')"
                  class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                  @keyup.enter="isValidEmail(email) && handleConfirm()"
                />
              </div>
              <p v-if="email && !isValidEmail(email)" class="mt-2 text-xs text-red-500 flex items-center gap-1 px-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ i18n.t('validation.invalidEmail') }}</span>
              </p>
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
                :disabled="!isValidEmail(email)"
                class="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95"
              >
                {{ i18n.t('lists.shareBtn') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Prevent any scrolling or overscroll on modal backdrop */
.fixed.inset-0 {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

.touch-none {
  touch-action: none;
}

.overscroll-none {
  overscroll-behavior: none;
}
</style>

