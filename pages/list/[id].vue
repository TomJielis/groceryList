<script setup lang="ts">
import {ref} from 'vue';
import {useRoute} from 'vue-router';


const route = useRoute();
const listId = route.params.id;
definePageMeta({
  middleware: 'auth',
});

import AddItemListForm from "~/components/list/AddItemListForm.vue";
import {useGroceryList} from "~/composables/useGroceryList";
let showAddItem = ref(false);
const list = useGroceryList();
const { items, fetchItems, increaseItems, decreaseItems, clearItem } = list;
await fetchItems(listId);


//TODO This must be fixed, That the items are not fetched again after adding an item
//Should be done by using a reactive variable
function handleItemAdded() {
  showAddItem.value = false;
  fetchItems();
}


</script>
<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Grocery List</h1>
    <div v-if="!showAddItem">
      <ul class="list-disc pl-5 space-y-2">
        <li class="flex items-center justify-between" v-for="item in items" :key="item.id">
          <span>{{ item.name }}</span>
          <div class="flex items-center space-x-2">
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="decreaseItems(item)">-</button>
            <span class="font-bold">{{ item.quantity || 1 }}</span>
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="increaseItems(item)">+</button>
            <button class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" @click="clearItem(item)">X</button>
          </div>
        </li>
      </ul>
      <button class="border border-gray-300 rounded px-4 py-2 w-full mb-2" @click="showAddItem = true">
        Add
      </button>
    </div>
    <div v-else>
      <AddItemListForm @item-added="handleItemAdded();" />
    </div>
  </div>
</template>
