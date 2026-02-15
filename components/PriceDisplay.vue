<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface Props {
  unitPrice?: number | null
  quantity?: number
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unitPrice: null,
  quantity: 1,
  showIcon: true
})

const i18n = useI18nStore()

const totalPrice = computed(() => {
  if (!props.unitPrice) return null
  return (props.unitPrice * props.quantity).toFixed(2)
})
</script>

<template>
  <div class="flex-shrink-0 flex items-center">
    <span
      v-if="totalPrice"
      class="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg"
    >
      €{{ totalPrice }}
    </span>
    <span
      v-else-if="showIcon"
      class="text-slate-300 dark:text-slate-600"
      :title="i18n.t('items.noPrice') || 'Geen prijs bekend'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </span>
  </div>
</template>

