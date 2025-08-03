<script setup lang="ts">
import {useGroceryList} from "~/composables/useGroceryList";
const list = useGroceryList();
const { lists, fetchLists } = list;

let openlistForm = ref(false);
await fetchLists();

async function handleList() {
  openlistForm.value = false;
  await fetchLists();
}


console.log(lists)
</script>

<template>
  <div class="container mx-auto p-4" v-if="!openlistForm">
    <h1 class="text-2xl font-bold mb-4">Grocery Lists</h1>
    <nuxtLink class="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="openlistForm = true">
      Create New List
    </nuxtLink>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ul class="list-disc pl-5 space-y-2">
        <li class="flex items-center justify-between" v-for="list in lists" :key="list.id">
          <span>{{ list.name }}</span>
          <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="$router.push(`/list/${list.id}`)">
            View
          </button>
        </li>
      </ul>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    </div>
  </div>
  <div class="container mx-auto p-4" v-else>
    <ListForm @list-added="handleList();"/>
  </div>
</template>