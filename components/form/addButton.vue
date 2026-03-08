<script setup lang="ts">
const emit = defineEmits(['click']);
</script>

<template>
  <button
      class="fixed bottom-24 right-6 z-60 bg-gradient-to-br from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-4xl transition border-4 border-white dark:border-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800"
      style="padding-bottom: env(safe-area-inset-bottom)"
      aria-label="Add item"
      @click="emit('click')"
  >
    <span class="pb-1">+</span>
  </button>
</template>
