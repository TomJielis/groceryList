<script setup lang="ts">
import {useGroceryList} from "~/composables/useGroceryList";

const { items, fetchItems } = useGroceryList();
await fetchItems()
console.log(items.value)
let topFive = ref(items.value.sort((a, b) => b.quantity - a.quantity).slice(0, 5));
</script>
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
      <span class="text-gray-500 flex-1 text-left">Item</span>
      <span class="text-gray-500 flex-1 text-right">Quantity</span>
    </div>
    <ul class="divide-y divide-gray-200">
      <li class="py-2 flex justify-center items-center text-center" v-for="item in topFive" :key="item.name">
        <span class="flex-1 text-left">{{ item.name }}</span>
        <span class="flex-1 text-right">{{ item.quantity }}</span>
      </li>
    </ul>
  </div>
</template>
