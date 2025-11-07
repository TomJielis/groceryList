<script setup lang="ts">
import {ref} from 'vue';
import {useGroceryList} from "~/composables/useGroceryList";
import {useI18nStore} from "~/stores/i18n";
import {useNotification} from '~/composables/useNotification';
import type {TGroceryList} from '@/types/TGroceryList';

const i18n = useI18nStore();
const pendingLists = ref<TGroceryList[]>([]);

useGroceryList().fetchPendingLists().then(lists => {
  pendingLists.value = lists || [];
});

const {updatePendingListStatus} = useGroceryList();
const notification = useNotification();

async function handleAction(id: number, status: 'accepted' | 'declined') {
  await updatePendingListStatus(id, status);
  pendingLists.value = pendingLists.value.filter(list => list.id !== id);
  if (status === 'accepted') {
    notification.showSuccess(i18n.t('lists.approvedMessage'));
  } else {
    notification.showSuccess(i18n.t('lists.declinedMessage'));
  }
}

function getCreatorName(list: TGroceryList): string {
  if (list.created_by && typeof list.created_by === 'object' && 'name' in list.created_by) {
    // @ts-ignore
    return list.created_by.name;
  }
  return 'Unknown';
}

</script>

<template>
  <div v-if="pendingLists && pendingLists.length > 0"
       class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-dark dark:text-accent-light">{{ pendingLists.length }} {{ pendingLists.length === 1 ? i18n.t('lists.pending-list') : i18n.t('lists.pending-lists') }}</h2>
    </div>
    <div v-if="!pendingLists || pendingLists.length === 0" class="text-center text-gray-500 py-8">
      {{ i18n.t('lists.noPending') }}
    </div>
    <ul v-else class="grid gap-6 sm:grid-cols-1">
      <li
          v-for="list in pendingLists"
          :key="list.id"
          class="border border-border-light bg-white/95 dark:bg-slate-900/95 rounded-xl transition hover:shadow-lg hover:border-accent/60 flex flex-col animate-fade-in p-4"
      >
        <div class=" items-center gap-2">
          <span class="font-semibold text-slate-700 dark:text-slate-100">{{ i18n.t('lists.name') }}:</span>
          <span class="ml-2 text-slate-600 dark:text-slate-300">{{ list.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-700 dark:text-slate-100">{{ i18n.t('lists.created_by') }}</span>
          <span class="ml-2 text-slate-600 dark:text-slate-300">{{ getCreatorName(list) }}</span>
        </div>
        <div class="flex flex-col gap-y-2 w-full mt-4">
          <button
              class="w-full px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition shadow font-semibold"
              @click="handleAction(list.id, 'accepted')">{{ i18n.t('lists.approve') }}
          </button>
          <button
              class="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow font-semibold"
              @click="handleAction(list.id, 'declined')">{{ i18n.t('lists.decline') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease;
}
</style>
