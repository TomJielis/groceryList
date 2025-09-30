<script setup lang="ts">
import {useNotification} from '~/composables/useNotification';

const {message, visible, type} = useNotification();
</script>

<template>
  <div
      v-if="message"
      class="fixed top-0 transform text-white p-4 text-center py-3 px-6 rounded-b-lg shadow-lg transition-transform flex items-center justify-between w-full z-50"
      :class="[
        { 'translate-y-full': !visible, 'translate-y-0': visible },
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]"
  >
    <div class="flex items-center justify-center w-full">
      <span v-if="type === 'success'" class="mr-2">✅</span>
      <span v-else class="mr-2">❌</span>
      <span class="flex-1">{{ message }}</span>
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
  transition: transform 0.3s ease-in-out;
}
</style>