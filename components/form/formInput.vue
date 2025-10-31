<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
  <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2  border-border-light dark:border-border-dark focus:ring-blue-400 focus:border-blue-400 text-base placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80"
  />
</template>


<style scoped>

</style>