<script setup lang="ts">

import { useGroceryList} from "~/composables/useGroceryList";

const pendingLists = await useGroceryList().fetchPendingLists();

</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light text-center">
      🛒 Pending Lists
    </h1>
    <ul class="space-y-5">
      <li
        v-for="list in pendingLists"
        :key="list.id"
        class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark transition relative hover:shadow-2xl hover:border-accent/60 group"
      >
        <div class="flex items-start justify-between">
          <div>
            <span class="text-base font-medium break-words whitespace-normal">
              {{ list.name }}
            </span>
            <div class="text-sm text-gray-500 mt-1">
              Creator: {{ list.creator?.name || 'Unknown' }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Title: {{ list.title || 'No title' }}
            </div>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">Approve</button>
            <button class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Decline</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
