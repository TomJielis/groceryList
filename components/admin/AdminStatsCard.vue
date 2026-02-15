<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

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
const i18n = useI18nStore()

// Percentage change: 0% = no change, >0% = increase, <0% = decrease
const isPositive = computed(() => (props.change?.percentage ?? 0) > 0)
const isNegative = computed(() => (props.change?.percentage ?? 0) < 0)
const isZero = computed(() => (props.change?.percentage ?? 0) === 0)
const changeColor = computed(() => {
  if (isZero.value) return 'text-slate-500 dark:text-slate-400'
  return isPositive.value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
})
const changeIcon = computed(() => {
  if (isZero.value) return '→'
  return isPositive.value ? '↑' : '↓'
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ title }}</h3>
    <div class="mt-2 flex items-baseline">
      <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ value }}</p>
      <!-- Show percentage change -->
      <p v-if="change && change.percentage !== null" :class="['ml-2 text-sm font-medium', changeColor]">
        {{ changeIcon }} {{ Math.abs(change.percentage) }}%
      </p>
    </div>
    <p v-if="previousValue !== undefined" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      {{ i18n.t('profile.previousMonth') || 'Vorige maand' }}: {{ previousValue }}
    </p>
  </div>
</template>
