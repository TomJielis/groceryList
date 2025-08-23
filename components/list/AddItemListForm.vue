<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import { useSuggestionStore } from '~/stores/suggestions'

import suggestionsData from '~/data/suggestions.json';
const {addItem} = useGroceryList();
const emit = defineEmits(['item-added', 'close']);

const suggestionStore = useSuggestionStore()

onMounted(() => {
  suggestionStore.fetchSuggestions()
})
const route = useRoute();
const listId = route.params.id as string;

const newItem = ref('');


async function addItemToList(itemName: string) {
  const name = itemName.trim();
  if (!name) return;

  await addItem(name, listId);

  newItem.value = '';
  emit('item-added');
}

const filteredSuggestions = computed(() => {
  const suggestions = suggestionStore.combinedSuggestions.filter(item =>
      item.name.toLowerCase().includes(newItem.value.toLowerCase())
  );
  return newItem.value ? [{ name: newItem.value }, ...suggestions] : suggestions;
});

</script>
<template>
  <div class="min-h-screen">
    <div class="flex-auto overflow-y-auto p-4">
      <div class="items-center flex-col">
        <input
            type="text"
            v-model="newItem"
            placeholder="Enter new item"
            class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg md:text-xl"
        />
        <ul class="space-y-3">
          <li
              v-for="item in filteredSuggestions"
              :key="item.name"
              class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5"
          >
            <div class="flex items-center space-x-2">
              <button @click="addItemToList(item.name)" class="text-lg sm:text-xl md:text-2xl">
                ➕
              </button>
              <span class="text-sm sm:text-base md:text-lg">{{ item.name }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full mt-6 space-y-3 p-4">
      <button
          class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"
          @click="$emit('close')"
      >
        ← Back
      </button>
    </div>
  </div>
</template>
