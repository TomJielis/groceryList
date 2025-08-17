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
  <div class="mt-6 max-w-md mx-auto px-4">
    <input
        type="text"
        v-model="newItem"
        placeholder="Enter new item"
        class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
    />
    <input
        type="number"
        v-model.number="listId"
        class="hidden"
    />
    <button
        class="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition"
        @click="addItemToList"
    >
      ➕ Create Item
    </button>
    <button
        class="w-full py-3 rounded-xl bg-gray-200 text-gray-800 font-medium text-base mt-3 hover:bg-gray-300 active:scale-[0.98] transition"
        @click="$emit('close')"
    >
      ← Go back
    </button>
  </div>
</template>
