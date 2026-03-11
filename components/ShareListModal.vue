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
    <div v-if="isVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 overflow-hidden overscroll-none touch-none" @click.self="handleClose" @touchmove.prevent>
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isVisible" class="bg-[#18181b] rounded max-w-md w-full border border-[#27272a] overflow-hidden max-h-[90vh]" @click.stop>
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
                  {{ i18n.t('lists.shareTitle') }}
                </h1>
                <p v-if="listName" class="text-sm text-[#71717a] truncate">
                  {{ listName }}
                </p>
              </div>

              <!-- Share Icon -->
              <div class="flex-shrink-0 w-10 h-10 bg-[#1e1e21] border border-[#27272a] rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 bg-[#18181b]">
            <!-- Instructions -->
            <p class="text-sm text-[#71717a] mb-4">
              {{ i18n.t('lists.sharePrompt') }}
            </p>

            <!-- Email Input -->
            <div class="mb-6">
              <label class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-2 block">
                {{ i18n.t('lists.emailAddress') }}
              </label>
              <input
                :value="email"
                @input="updateEmail"
                type="email"
                :placeholder="i18n.t('lists.shareEmailPlaceholder')"
                class="w-full py-2 border-b border-[#27272a] focus:border-[#52525b] bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] outline-none transition text-base"
                @keyup.enter="isValidEmail(email) && handleConfirm()"
              />
              <p v-if="email && !isValidEmail(email)" class="mt-2 text-xs text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ i18n.t('validation.invalidEmail') }}</span>
              </p>
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
                :disabled="!isValidEmail(email)"
                class="flex-1 px-4 py-3 bg-[#fafafa] text-[#18181b] hover:bg-[#d4d4d8] disabled:opacity-40 disabled:cursor-not-allowed font-medium rounded transition-all active:scale-95"
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
