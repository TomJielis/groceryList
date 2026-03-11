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
  if (change.value.isZero) return 'text-[#a1a1aa]'
  return change.value.isPositive ? 'text-[#a1a1aa]' : 'text-[#71717a]'
})

const changeIcon = computed(() => {
  if (change.value.isZero) return '→'
  return change.value.isPositive ? '↑' : '↓'
})
</script>

<template>
  <div class="border-b border-[#27272a] py-4 space-y-1">
    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">{{ title }}</p>
    <div class="flex items-baseline gap-2">
      <p class="text-xl font-light text-[#fafafa]">{{ value }}</p>
      <p v-if="change.percentage !== null && showPercentage" :class="['text-sm font-medium', changeColor]">
        {{ changeIcon }} {{ Math.abs(change.percentage) }}%
      </p>
    </div>
    <p v-if="showPercentage" class="text-xs text-[#71717a]">
      {{ i18n.t('profile.previousMonth') }} · {{ previousValue ?? 0 }}
    </p>
  </div>
</template>
