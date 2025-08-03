<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
const emit = defineEmits(['list-added']);
const { createList } = useGroceryList();

let newList = ref('');

async function addList() {
    createList(newList.value.trim());
    newList.value = '';
    emit('list-added');
}
</script>

<template>
  <div class="mt-4">
    <input
        type="text"
        v-model="newList"
        placeholder="Enter new item"
        class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
    />
    <button
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="addList"
    >
      Add List
    </button>
  </div>
</template>
>