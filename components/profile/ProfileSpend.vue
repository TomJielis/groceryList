<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface SpendByList {
  id: number
  name: string
  total: number
}

interface SpendMonth {
  total: number
  by_list: SpendByList[]
}

interface UserBreakdownEntry {
  user_id: number
  user_name: string
  checked: number
  added: number
}

interface Props {
  spend: {
    current_month: SpendMonth
    previous_month: SpendMonth
  }
  user_breakdown?: {
    current_month: UserBreakdownEntry[]
    previous_month: UserBreakdownEntry[]
  }
}

const props = defineProps<Props>()
const i18n = useI18nStore()

const hasSpend = computed(() =>
  (props.spend?.current_month?.total ?? 0) > 0 ||
  (props.spend?.previous_month?.total ?? 0) > 0
)

const listsWithSpend = computed(() =>
  props.spend?.current_month?.by_list?.filter((l) => l.total > 0) ?? []
)
</script>

<template>
  <div class="list-item-row rounded p-5">
    <div v-if="!hasSpend" class="py-4 text-sm text-surface-500 text-center">
      {{ i18n.t('profile.noSpendData') }}
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-baseline gap-3">
        <p class="text-2xl font-light">€{{ spend.current_month.total.toFixed(2) }}</p>
        <p class="text-sm text-surface-500">
          {{ i18n.t('profile.previousMonth') }}: €{{ spend.previous_month.total.toFixed(2) }}
        </p>
      </div>

      <table v-if="listsWithSpend.length > 0" class="w-full text-sm">
        <thead>
          <tr class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-400">
            <th class="text-left pb-2">{{ i18n.t('profile.listName') }}</th>
            <th class="text-right pb-2">{{ i18n.t('profile.spendAmount') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <tr v-for="list in listsWithSpend" :key="list.id">
            <td class="py-2 text-surface-700">{{ list.name }}</td>
            <td class="py-2 text-right font-medium">€{{ list.total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="user_breakdown?.current_month && user_breakdown.current_month.length > 1"
      class="mt-4 pt-4 border-t border-surface-200"
    >
      <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium text-surface-400 mb-3">
        {{ i18n.t('profile.userBreakdown') }}
      </p>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-400">
            <th class="text-left pb-2">{{ i18n.t('profile.userName') }}</th>
            <th class="text-center pb-2">{{ i18n.t('profile.added') }}</th>
            <th class="text-center pb-2">{{ i18n.t('profile.checked') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <tr v-for="entry in user_breakdown.current_month" :key="entry.user_id">
            <td class="py-2 text-surface-700">{{ entry.user_name }}</td>
            <td class="py-2 text-center">{{ entry.added }}</td>
            <td class="py-2 text-center">{{ entry.checked }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
