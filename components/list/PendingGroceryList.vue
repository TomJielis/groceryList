<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGroceryList } from '~/composables/useGroceryList';
import type { TGroceryList } from '@/types/TGroceryList';
import { useI18nStore } from '~/stores/i18n';

const { fetchPendingLists } = useGroceryList();
const i18n = useI18nStore();
const pendingLists = ref<TGroceryList[]>([]);
const loading = ref(true);

onMounted(async () => {
  const result = await fetchPendingLists();
  pendingLists.value = result || [];
  loading.value = false;
});
</script>

<template>
  <div class="flex flex-col gap-6 mt-4">
    <div v-if="loading" class="text-center text-slate-500 dark:text-slate-400 py-8">
      {{ i18n.t('common.loading') }}
    </div>
    <template v-else>
      <div v-if="pendingLists.length === 0" class="text-center text-slate-500 dark:text-slate-400 py-8">
        {{ i18n.t('lists.noPending') }}
      </div>
      <ul v-else class="space-y-4">
        <li v-for="list in pendingLists" :key="list.id"
            class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-4 md:p-5 border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60 flex flex-col">
          <div class="flex items-center justify-between">
            <span class="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{{ list.name }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ i18n.t('lists.pending') }}</span>
          </div>
          <div class="flex items-center justify-end mt-2">
            <button class="px-4 py-2 rounded-xl bg-accent text-white font-semibold shadow-md hover:bg-accent-dark transition border border-accent/80 focus:ring-2 focus:ring-accent">
              {{ i18n.t('lists.remind') }}
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>


