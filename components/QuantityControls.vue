<script setup lang="ts">
interface Props {
  quantity: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  increase: []
  decrease: []
}>()
</script>

<template>
  <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-lg p-1.5">
    <button
      @click="emit('decrease')"
      :disabled="disabled"
      class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      −
    </button>
    <span class="min-w-[2rem] text-center text-lg font-bold text-slate-900 dark:text-white">
      {{ quantity }}
    </span>
    <button
      @click="emit('increase')"
      :disabled="disabled"
      class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      +
    </button>
  </div>
</template>

