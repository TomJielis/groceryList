<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";

const listStore = useListStore();
const {showNotification} = useNotification();
const emit = defineEmits(['list-added', 'close']);
const { createList } = useGroceryList();

let newList = ref('');

async function addList() {
  createList(newList.value.trim())
      .then((data) => {
        listStore.addList(data.data);
        newList.value = '';
        emit('list-added');
      })
      .catch((error) => {
        showNotification(error);
      });
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
  <div class="fixed bottom-0 left-0 w-full mt-6 space-y-3 p-4">
    <button
        class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"
        @click="$emit('close')"
    >
      ← Back
    </button>
  </div>
</template>
