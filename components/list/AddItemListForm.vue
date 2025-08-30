<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import { useSuggestionStore } from '~/stores/suggestions'

import suggestionsData from '~/data/suggestions.json';
const {
  addItem,
  items,
  fetchItems,
  increaseItems,
  decreaseItems
} = useGroceryList();
const emit = defineEmits(['item-added', 'close']);

const suggestionStore = useSuggestionStore()

onMounted(() => {
  suggestionStore.fetchSuggestions()
})
const route = useRoute();
const listId = parseInt(route.params.id as string)

const newItem = ref('');


async function addItemToList(itemName: string) {
  const name = itemName.trim();
  if (!name) return;

  await addItem(name, listId);

  await fetchItems(listId);

  newItem.value = '';
}

const filteredSuggestions = computed(() => {
  const suggestions = suggestionStore.combinedSuggestions.filter(item =>
      item.name.toLowerCase().includes(newItem.value.toLowerCase())
  );
  const isDuplicate = suggestions.some(item => item.name.toLowerCase() === newItem.value.toLowerCase());
  return newItem.value && !isDuplicate ? [{ name: newItem.value, checked:false }, ...suggestions] : suggestions;
});

fetchItems(listId)
</script>
<template>
  <div class="min-h-screen">
    <div class="flex-auto overflow-y-auto p-4 pb-20">
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
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center space-x-2">
                <button @click="addItemToList(item.name)" :class="items.some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()) ? 'text-green-500' : 'text-black'">
                  {{ items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()) ? '✔️' : '➕' }}
                </button>
                <span class="text-sm sm:text-base md:text-lg">{{ item.name }}</span>
              </div>
              <div class="flex items-center space-x-2" v-if="items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())">
                <button
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                    @click="decreaseItems(items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()))"
                >−
                </button>

                <span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">
                   {{ items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())?.quantity ?? 1 }}
                </span>

                <button
                    v-if="items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())"
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                    @click="increaseItems(items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()))"
                >+
                </button>
              </div>
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
