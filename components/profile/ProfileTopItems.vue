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
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Most Added -->
    <div>
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
        {{ i18n.t('profile.mostAdded') || 'Meest toegevoegd' }}
      </h3>
      <ul v-if="topItems.current_month?.most_added?.length > 0" class="space-y-2">
        <li
          v-for="(item, index) in topItems.current_month.most_added.slice(0, 5)"
          :key="index"
          class="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
        >
          <span class="text-slate-700 dark:text-slate-300">
            <span class="font-medium text-slate-400 dark:text-slate-500 mr-2">{{ index + 1 }}.</span>
            {{ item.name }}
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
            {{ item.count }}x
          </span>
        </li>
      </ul>
      <p v-else class="text-slate-500 dark:text-slate-400 text-sm">
        {{ i18n.t('profile.noTopItems') || 'Geen items deze maand' }}
      </p>
    </div>

    <!-- Most Checked -->
    <div>
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
        {{ i18n.t('profile.mostChecked') || 'Meest afgevinkt' }}
      </h3>
      <ul v-if="topItems.current_month?.most_checked?.length > 0" class="space-y-2">
        <li
          v-for="(item, index) in topItems.current_month.most_checked.slice(0, 5)"
          :key="index"
          class="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
        >
          <span class="text-slate-700 dark:text-slate-300">
            <span class="font-medium text-slate-400 dark:text-slate-500 mr-2">{{ index + 1 }}.</span>
            {{ item.name }}
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
            {{ item.count }}x
          </span>
        </li>
      </ul>
      <p v-else class="text-slate-500 dark:text-slate-400 text-sm">
        {{ i18n.t('profile.noTopItems') || 'Geen items deze maand' }}
      </p>
    </div>
  </div>
</template>
