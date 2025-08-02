<script setup lang="ts">
import {ref} from 'vue';

definePageMeta({
  middleware: 'auth',
});

import AddItemListForm from "~/components/list/AddItemListForm.vue";
const {items, fetchItems,  increaseItems, decreaseItems, clearItem} = useList();
await fetchItems()
let showAddItem = ref(false);

</script>
<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Grocery List</h1>
    <div v-if="!showAddItem">
      <ul class="list-disc pl-5 space-y-2">
        <li class="flex items-center justify-between" v-for="item in items" :key="item">
          <span>{{ item.name }}</span>
          <div class="flex items-center space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="decreaseItems(item.name)">-</button>
            <span class="font-bold">{{ item.quantity || 1 }}</span>
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="increaseItems(item.name)">+</button>
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="clearItem(item.name)">X</button>
          </div>
        </li>
      </ul>
      <button class="border border-gray-300 rounded px-4 py-2 w-full mb-2" @click="showAddItem = true">
        Add
      </button>
    </div>
    <div v-else>
      <AddItemListForm @item-added="() => { showAddItem = false; items = useList().items.value; }" />
    </div>
  </div>
</template>
