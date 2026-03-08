<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder: string;
  label?: string;
  inputType: 'text' | 'password' | 'email';
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block px-1">{{ label }}</label>
    <input
        :type="inputType"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium placeholder:text-slate-400 transition',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-slate-50 dark:bg-slate-900'
        ]"
    />
  </div>
</template>