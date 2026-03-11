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
    <label v-if="label" class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-2 block">{{ label }}</label>
    <input
        :type="inputType"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full py-2 border-b border-[#27272a] focus:border-[#52525b] bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] outline-none text-base transition',
          disabled
            ? 'text-[#52525b] cursor-not-allowed'
            : ''
        ]"
    />
  </div>
</template>