<script setup lang="ts">
import {useNotification} from '~/composables/useNotification';

const {message, visible, type} = useNotification();
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="message && visible"
      class="fixed top-0 left-0 right-0 z-[9999] w-full flex items-center justify-center px-4 pt-4 md:pt-20 pointer-events-none"
    >
      <div
        class="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-semibold text-base backdrop-blur-xl border pointer-events-auto transform hover:scale-[1.02] transition-transform duration-200"
        :class="[
          type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white'
            : 'bg-gradient-to-r from-red-500 to-rose-500 border-red-400 text-white',
          'max-w-md w-full'
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg
            v-if="type === 'success'"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Message -->
        <span class="flex-1 text-center font-medium">{{ message }}</span>

        <!-- Decorative Pulse -->
        <div
          class="absolute inset-0 rounded-2xl animate-pulse opacity-30"
          :class="[
            type === 'success' ? 'bg-green-300' : 'bg-red-300'
          ]"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>