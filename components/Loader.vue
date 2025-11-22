<template>
  <div class="fixed inset-0 flex justify-center items-center pb-20">
    <div class="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

