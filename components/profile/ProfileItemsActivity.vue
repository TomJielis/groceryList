<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

interface Props {
  items: {
    current_month: { added: number; checked: number; period: string }
    previous_month: { added: number; checked: number; period: string }
    change?: { absolute: number; percentage: number | null }
  }
}

defineProps<Props>();

const i18n = useI18nStore();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <AdminStatsCard
      :title="i18n.t('profile.itemsAddedMonth') || 'Items toegevoegd'"
      :value="items?.current_month?.added ?? 0"
      :change="items?.change"
      :previous-value="items?.previous_month?.added"
    />
    <AdminStatsCard
      :title="i18n.t('profile.itemsCheckedMonth') || 'Items afgevinkt'"
      :value="items?.current_month?.checked ?? 0"
      :previous-value="items?.previous_month?.checked"
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
