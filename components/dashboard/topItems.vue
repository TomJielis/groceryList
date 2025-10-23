<script setup lang="ts">
import {useGroceryList} from "~/composables/useGroceryList";

const { items, fetchItems } = useGroceryList();
await fetchItems()
let topFive = ref(items.value.filter(item => !item.checked).sort((a, b) => b.quantity - a.quantity).slice(0, 5));
</script>
<template>
  <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60">
    <div class="flex justify-between mb-4">
      <span class="text-slate-500 dark:text-slate-400 flex-1 text-left font-semibold">Item</span>
      <span class="text-slate-500 dark:text-slate-400 flex-1 text-right font-semibold">Quantity</span>
    </div>
    <ul class="divide-y divide-border-light dark:divide-border-dark">
      <li class="py-3 flex justify-center items-center text-center hover:bg-accent/5 rounded-xl transition" v-for="item in topFive" :key="item.name">
        <span class="flex-1 text-left text-slate-800 dark:text-slate-100 font-medium">{{ item.name }}</span>
        <span class="flex-1 text-right text-accent font-bold">{{ item.quantity }}</span>
      </li>
    </ul>
  </div>
</template>
