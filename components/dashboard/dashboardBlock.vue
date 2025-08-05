<script setup lang="ts">
  defineProps<{ title: string, count: number}>();
</script>
<template>
  <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
    <span class="text-4xl font-bold text-green-600">{{ count }}</span>
    <span class="text-gray-500 mt-2">{{ title }}</span>
  </div>
</template>
