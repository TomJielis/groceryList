<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import { calculateChange } from '~/utils/calculateChange'

interface Props {
  title: string
  value: number | string
  previousValue?: number | string
  showPercentage?: boolean
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
  if (change.value.isZero) return 'text-slate-300'
  return change.value.isPositive ? 'text-emerald-300' : 'text-rose-300'
})

const changeIcon = computed(() => {
  if (change.value.isZero) return '→'
  return change.value.isPositive ? '↑' : '↓'
})
</script>

<template>
  <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl text-white/90 space-y-2">
    <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">{{ title }}</p>
    <div class="flex items-baseline gap-2">
      <p class="text-3xl font-semibold text-white">{{ value }}</p>
      <p v-if="change.percentage !== null && showPercentage" :class="['text-sm font-semibold', changeColor]">
        {{ changeIcon }} {{ Math.abs(change.percentage) }}%
      </p>
    </div>
    <p v-if="showPercentage" class="text-xs text-slate-400">
      {{ i18n.t('profile.previousMonth') || 'Vorige maand' }} · {{ previousValue ?? 0 }}
    </p>
  </div>
</template>
