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
    </div>
    <ul class="space-y-5">
      <li
          v-for="list in pendingLists"
          :key="list.id"
          class="p-5 border-b border-border-light"
      >
        <div class="flex items-start justify-between">
          <div>
            <span class="text-base font-medium break-words whitespace-normal">
              {{ list.name }}
            </span>
            <div v-if="list.created_by" class="text-sm text-gray-500 mt-1">
              Creator: {{ list.created_by.name || 'Unknown' }}
            </div>
            <div v-if="list.title" class="text-sm text-gray-500 mt-1">
            </div>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">Approve
            </button>
            <button class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Decline</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
