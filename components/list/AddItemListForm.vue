<script setup lang="ts">
import {ref, defineEmits} from "vue";
const { addItem} = useList();
const emit = defineEmits(['item-added']);

let newItem = ref('');

async function addItemToList() {

  if (newItem.value.trim() !== '') {
    await addItem(newItem.value.trim());
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
    <button
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="addItemToList"
    >
      Add Item
    </button>
  </div>
</template>
>