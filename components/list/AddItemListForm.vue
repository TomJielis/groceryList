<script setup lang="ts">
import {useRoute} from 'vue-router';
import {ref, defineEmits} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
const { addItem} = useGroceryList();
const emit = defineEmits(['item-added']);


const route = useRoute();
const listId = route.params.id;

let newItem = ref('');

async function addItemToList() {

  if (newItem.value.trim() !== '') {
    await addItem(newItem.value.trim(), listId);
    newItem.value = '';
    emit('item-added');
  }
}
</script>

<template>
  <div class="mt-4">
    <input
        type="text"
        v-model="newItem"
        placeholder="Enter new item"
        class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
    />
    <input
        type="number"
        v-model.number="listId"
        class="border border-gray-300 rounded px-4 py-2 w-full mb-2 hidden"
        />
    <button
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="addItemToList"
    >
      Add Item
    </button>
  </div>
</template>
>