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
    <label v-if="label" class="text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-2 block" style="color: var(--p-surface-500)">{{ label }}</label>
    <input
        :type="inputType"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full py-2 border-b focus:outline-none text-base transition',
          disabled
            ? 'cursor-not-allowed'
            : ''
        ]"
        style="border-color: var(--p-surface-300); background: transparent; color: var(--p-surface-900);"
    />
  </div>
</template>
