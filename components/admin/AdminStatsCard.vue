<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  change?: {
    absolute: number
    percentage: number | null
  }
  previousValue?: number | string
}

const props = defineProps<Props>()

const isPositive = computed(() => (props.change?.absolute ?? 0) >= 0)
const changeColor = computed(() => isPositive.value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
const changeIcon = computed(() => isPositive.value ? '↑' : '↓')
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ title }}</h3>
    <div class="mt-2 flex items-baseline">
      <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ value }}</p>
      <p v-if="change && change.percentage !== null" :class="['ml-2 text-sm font-medium', changeColor]">
        {{ changeIcon }} {{ Math.abs(change.percentage) }}%
      </p>
    </div>
    <p v-if="previousValue !== undefined" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Vorige maand: {{ previousValue }}
    </p>
  </div>
</template>
