<script setup lang="ts">
import {useNotification} from '~/composables/useNotification';

const {message, visible, type} = useNotification();
</script>

<template>
  <div
      v-if="message"
      class="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-center transition-transform"
      :class="[
        { 'translate-y-full': !visible, 'translate-y-0': visible }
      ]"
  >
    <div
        class="flex items-center gap-2 px-6 py-3 rounded-b-2xl shadow-2xl font-semibold text-base md:text-lg backdrop-blur-lg border border-border-light dark:border-border-dark"
        :class="[
       type === 'success' ? 'bg-success' : '',
       type === 'error' ? 'bg-error' : '',
       type === 'success' ? 'dark:bg-success/90' : '',
       type === 'error' ? 'dark:bg-error/90' : '',

        'max-w-xl w-full justify-center',
      ]"
    >
      <span v-if="type === 'success'" class="text-xl">✅</span>
      <span v-else class="text-xl">❌</span>
      <span class="flex-1 text-center">{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
.translate-y-full {
  transform: translateY(-100%);
}

.translate-y-0 {
  transform: translateY(0);
}

.transition-transform {
  transition: transform 0.3s cubic-bezier(.4, 0, .2, 1);
}
</style>