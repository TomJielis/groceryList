<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

interface TopItem {
  name: string;
  count: number;
}

interface Props {
  topItems: {
    current_month?: {
      most_added?: TopItem[];
      most_checked?: TopItem[];
    };
  };
}

defineProps<Props>();
const i18n = useI18nStore();
</script>

<template>
  <div class="list-item-row rounded p-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Most Added -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium text-surface-400 mb-3">
          {{ i18n.t('profile.mostAdded') }}
        </p>
        <ul v-if="topItems.current_month?.most_added?.length > 0" class="divide-y divide-surface-100">
          <li
            v-for="(item, index) in topItems.current_month.most_added.slice(0, 5)"
            :key="index"
            class="flex justify-between items-center py-2.5"
          >
            <span class="flex items-center gap-2 text-sm">
              <span class="text-surface-400 font-medium w-4">{{ index + 1 }}.</span>
              <span>{{ item.name }}</span>
            </span>
            <span class="text-xs border border-surface-200 text-surface-500 px-2 py-0.5 rounded">
              {{ item.count }}x
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-surface-500">{{ i18n.t('profile.noTopItems') }}</p>
      </div>

      <!-- Most Checked -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium text-surface-400 mb-3">
          {{ i18n.t('profile.mostChecked') }}
        </p>
        <ul v-if="topItems.current_month?.most_checked?.length > 0" class="divide-y divide-surface-100">
          <li
            v-for="(item, index) in topItems.current_month.most_checked.slice(0, 5)"
            :key="index"
            class="flex justify-between items-center py-2.5"
          >
            <span class="flex items-center gap-2 text-sm">
              <span class="text-surface-400 font-medium w-4">{{ index + 1 }}.</span>
              <span>{{ item.name }}</span>
            </span>
            <span class="text-xs border border-surface-200 text-surface-500 px-2 py-0.5 rounded">
              {{ item.count }}x
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-surface-500">{{ i18n.t('profile.noTopItems') }}</p>
      </div>
    </div>
  </div>
</template>
