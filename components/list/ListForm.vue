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
  <div class="mt-6 max-w-md mx-auto px-4">
    <input
        type="text"
        v-model="newList"
        placeholder="Enter new list"
        class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
    />
    <button
        class="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition"
        @click="addList"
    >
      ➕ Create List
    </button>
  </div>
</template>
