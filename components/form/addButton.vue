<script setup lang="ts">
const emit = defineEmits(['click']);
</script>

<template>
  <button
      class="fixed bottom-24 right-6 z-60 rounded font-medium w-14 h-14 flex items-center justify-center transition-all active:scale-95"
      style="background: var(--p-primary-color); color: #fff; padding-bottom: env(safe-area-inset-bottom)"
      aria-label="Add item"
      @click="emit('click')"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
    </svg>
  </button>
</template>
