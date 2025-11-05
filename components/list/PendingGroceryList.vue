<script setup lang="ts">

import {useGroceryList} from "~/composables/useGroceryList";
import {useI18nStore} from "~/stores/i18n";

const i18n = useI18nStore();

const pendingLists = await useGroceryList().fetchPendingLists();

</script>

<template>
  <div
      class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-dark dark:text-accent-light">{{ i18n.t('lists.pending-lists') }}</h2>
      <span v-if="pendingLists && pendingLists.length > 0" class="text-sm text-accent font-semibold">{{ pendingLists.length }} {{ i18n.t('lists.invitations') }}</span>
    </div>
    <div v-if="!pendingLists || pendingLists.length === 0" class="text-center text-gray-500 py-8">
      {{ i18n.t('lists.noPending') }}
    </div>
    <ul v-else class="space-y-5">
      <li
          v-for="list in pendingLists"
          :key="list.id"
          class="p-5 border-b border-border-light bg-white/95 dark:bg-slate-900/95 rounded-xl transition hover:shadow-lg hover:border-accent/60 flex flex-col animate-fade-in"
      >
        <div class="flex items-start justify-between">
          <div>
            <span class="text-base font-medium break-words whitespace-normal flex items-center gap-2">
              <span v-if="pendingLists.length === 1" class="inline-block px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold">{{ i18n.t('lists.invited') }}</span>
              {{ list.name }}
            </span>
            <div v-if="list.created_by && typeof list.created_by === 'object' && list.created_by.name" class="text-sm text-gray-500 mt-1">
              Creator: {{ list.created_by.name }}
            </div>
            <div v-else class="text-sm text-gray-500 mt-1">
              Creator: Unknown
            </div>
          </div>
          <div class="flex gap-2 mt-2 md:mt-0">
            <button class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition shadow font-semibold">Approve</button>
            <button class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow font-semibold">Decline</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease;
}
</style>
