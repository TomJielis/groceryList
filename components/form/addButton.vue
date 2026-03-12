<script setup lang="ts">
import Button from 'primevue/button'
const emit = defineEmits(['click'])
</script>

<template>
  <Button
    severity="primary"
    rounded
    aria-label="Add item"
    class="fixed bottom-24 right-6 z-60 w-14 h-14 !p-0 transition-all active:scale-95"
    style="padding-bottom: env(safe-area-inset-bottom)"
    @click="emit('click')"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
    </svg>
  </Button>
</template>
