<script setup lang="ts">
  defineProps<{ title: string, count: number}>();
</script>
<template>
  <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60">
    <span class="text-4xl font-extrabold text-accent">{{ count }}</span>
    <span class="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">{{ title }}</span>
  </div>
</template>
