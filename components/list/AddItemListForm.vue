<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import {useSuggestionStore} from '~/stores/suggestions'
import { useI18nStore } from '~/stores/i18n';
import formInput from "~/components/form/formInput.vue"

const {
  addItem,
  items,
  fetchItems,
  increaseItems,
  decreaseItems
} = useGroceryList();
const emit = defineEmits(['item-added', 'close']);

const suggestionStore = useSuggestionStore()
const i18n = useI18nStore();

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
  return newItem.value && !isDuplicate ? [{name: newItem.value, checked: false}, ...suggestions] : suggestions;
});

fetchItems(listId)
</script>
<template>
  <div class="flex-auto overflow-y-auto p-4 pb-20 md:pb-4 h-[80vh]">
    <div class="items-center flex-col">
      <formInput
          v-model="newItem"
          :placeholder="i18n.t('items.addPlaceholder')"
      />
      <ul class="space-y-4">
        <li
            v-for="item in filteredSuggestions"
            :key="item.name"
            class="flex items-center justify-between bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-4 md:p-5 border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-3">
              <button @click="addItemToList(item.name)"
                      :class="items.some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()) ? 'text-success' : 'text-accent'"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-accent/10 hover:bg-accent/20 transition text-xl font-bold shadow-sm border border-transparent focus:ring-2 focus:ring-accent">
                {{
                  items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()) ? '✔️' : '➕'
                }}
              </button>
              <span class="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-2"
                 v-if="items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())">
              <button
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-full text-base sm:text-lg font-bold hover:bg-accent/20 text-slate-700 dark:text-slate-100 transition border border-border-light dark:border-border-dark"
                  @click="decreaseItems(items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()))"
              >−
              </button>
              <span class="text-base font-semibold min-w-[24px] text-center text-slate-800 dark:text-slate-100">
                   {{ items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())?.quantity ?? 1 }}
                </span>

              <button
                  v-if="items.filter(item => !item.checked).some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())"
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-full text-base sm:text-lg font-bold hover:bg-accent/20 text-slate-700 dark:text-slate-100 transition border border-border-light dark:border-border-dark"                  @click="increaseItems(items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()))"
              >+
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="fixed left-0 w-full mt-6 space-y-3 p-4 bottom-20 md:bottom-3 z-50">
    <button
        class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"
        @click="$emit('close')"
    >
      ← {{ i18n.t('common.back') }}
    </button>
  </div>
</template>
