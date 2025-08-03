<script setup lang="ts">
import TopItems from "~/components/dashboard/topItems.vue";
import DashboardBlock from "~/components/dashboard/dashboardBlock.vue";
import {useGroceryList} from "~/composables/useGroceryList";
definePageMeta({
  middleware: 'auth',
});
const { lists, items, fetchLists, fetchItems } = useGroceryList();
await fetchItems()
await fetchLists();
let count = ref(items.value.length ?? 0);
let countLists = ref(lists.value.length ?? 0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-green-700 mb-6 text-center">
        Grocery Shopping List Dashboard
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <dashboardBlock :title="'Items to buy'" :count="count" @click="$router.push('/list')" class="cursor-pointer"/>
        <dashboardBlock :title="'Lists'" @click="$router.push('/lists')" :count="parseInt(countLists)" />
        <dashboardBlock :title="'Stores'" :count="parseInt('2')" />
      </div>
      <topItems />
    </div>
  </div>
</template>

<!-- Tailwind CSS should be included in your project for the above classes to work.
If not already set up, add the following to your main entry file (e.g., main.ts or main.js):

import 'tailwindcss/tailwind.css'
-->