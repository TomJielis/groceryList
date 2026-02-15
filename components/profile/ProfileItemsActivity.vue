<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

interface Props {
  items: {
    current_month: { added: number; checked: number; period: string }
    previous_month: { added: number; checked: number; period: string }
    change?: { absolute: number; percentage: number | null }
  }
  invalid_login_attempts?: {
    current_month: number
    previous_month: number
    change?: { absolute: number; percentage: number | null }
  }
}

const props = defineProps<Props>();

const i18n = useI18nStore();

// Calculate percentage change
const calculateChange = (current: number, previous: number) => {
  const absolute = current - previous
  let percentage: number
  if (previous > 0) {
    percentage = Math.round((current / previous) * 100)
  } else if (current > 0) {
    // Previous was 0, current > 0 = 100% new
    percentage = 100
  } else {
    // Both are 0
    percentage = 0
  }
  return { absolute, percentage }
}

// Calculate change for added items
const addedChange = computed(() => {
  const current = props.items?.current_month?.added ?? 0
  const previous = props.items?.previous_month?.added ?? 0
  return calculateChange(current, previous)
})

// Calculate change for checked items
const checkedChange = computed(() => {
  const current = props.items?.current_month?.checked ?? 0
  const previous = props.items?.previous_month?.checked ?? 0
  return calculateChange(current, previous)
})

const invalidLoginChange = computed(() => {
  const current = props?.invalid_login_attempts?.current_month ?? 0
  const previous = props?.invalid_login_attempts?.previous_month ?? 0
  return calculateChange(current, previous)
})

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <AdminStatsCard
      :title="i18n.t('profile.itemsAddedMonth')"
      :value="items?.current_month?.added ?? 0"
      :change="addedChange"
      :previous-value="items?.previous_month?.added"
    />
    <AdminStatsCard
      :title="i18n.t('profile.itemsCheckedMonth')"
      :value="items?.current_month?.checked ?? 0"
      :change="checkedChange"
      :previous-value="items?.previous_month?.checked"
    />
    <AdminStatsCard
      :title="i18n.t('profile.invalidLoginAttempts')"
      :value="props?.invalid_login_attempts?.current_month ?? 0"
      :change="invalidLoginChange"
      :previous-value="props?.invalid_login_attempts?.previous_month"
    />
    <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">
        {{ i18n.t('profile.previousMonth') || 'Vorige maand' }} ({{ items?.previous_month?.period }})
      </h3>
      <p class="mt-2 text-lg text-slate-700 dark:text-slate-300">
        {{ items?.previous_month?.added ?? 0 }} {{ i18n.t('profile.added') || 'toegevoegd' }},
        {{ items?.previous_month?.checked ?? 0 }} {{ i18n.t('profile.checked') || 'afgevinkt' }}
      </p>
    </div>
  </div>
</template>
