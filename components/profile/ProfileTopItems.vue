<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import Card from 'primevue/card';

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
  <Card>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Most Added -->
        <div>
          <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-3">
            {{ i18n.t('profile.mostAdded') }}
          </p>
          <ul v-if="topItems.current_month?.most_added?.length > 0">
            <li
              v-for="(item, index) in topItems.current_month.most_added.slice(0, 5)"
              :key="index"
              class="flex justify-between items-center py-2.5 border-b last:border-0"
            >
              <span>
                <span class="mr-2">{{ index + 1 }}.</span>
                {{ item.name }}
              </span>
              <span class="text-xs border px-2 py-0.5 rounded">
                {{ item.count }}x
              </span>
            </li>
          </ul>
          <p v-else class="text-sm">
            {{ i18n.t('profile.noTopItems') }}
          </p>
        </div>

        <!-- Most Checked -->
        <div>
          <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-3">
            {{ i18n.t('profile.mostChecked') }}
          </p>
          <ul v-if="topItems.current_month?.most_checked?.length > 0">
            <li
              v-for="(item, index) in topItems.current_month.most_checked.slice(0, 5)"
              :key="index"
              class="flex justify-between items-center py-2.5 border-b last:border-0"
            >
              <span>
                <span class="mr-2">{{ index + 1 }}.</span>
                {{ item.name }}
              </span>
              <span class="text-xs border px-2 py-0.5 rounded">
                {{ item.count }}x
              </span>
            </li>
          </ul>
          <p v-else class="text-sm">
            {{ i18n.t('profile.noTopItems') }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
