<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import { calculateChange } from '~/utils/calculateChange'

interface Props {
  title: string
  value: number | string
  previousValue?: number | string
}

const props = defineProps<Props>()
const i18n = useI18nStore()

// Calculate percentage using the shared helper
const change = computed(() => {
  const current = typeof props.value === 'number' ? props.value : Number(props.value) || 0
  const previous = typeof props.previousValue === 'number' ? props.previousValue : Number(props.previousValue) || 0
  return calculateChange(current, previous)
})

const changeColor = computed(() => {
  if (change.value.isZero) return 'text-slate-500 dark:text-slate-400'
  return change.value.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
})

const changeIcon = computed(() => {
  if (change.value.isZero) return '→'
  return change.value.isPositive ? '↑' : '↓'
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ title }}</h3>
    <div class="mt-2 flex items-baseline">
      <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ value }}</p>
      <!-- Show percentage change -->
      <p v-if="previousValue !== undefined && change.percentage !== null" :class="['ml-2 text-sm font-medium', changeColor]">
        {{ changeIcon }} {{ Math.abs(change.percentage) }}%
      </p>
    </div>
    <p v-if="previousValue !== undefined" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      {{ i18n.t('profile.previousMonth') || 'Vorige maand' }}: {{ previousValue }}
    </p>
  </div>
</template>
