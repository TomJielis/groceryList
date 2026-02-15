<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import {useSuggestionStore} from '~/stores/suggestions'
import { useI18nStore } from '~/stores/i18n';
import {useListStore} from '~/stores/lists';

const {
  addItem,
  items,
  fetchItems,
  increaseItems,
  decreaseItems,
  clearItem
} = useGroceryList();

const emit = defineEmits(['item-added', 'close']);

const suggestionStore = useSuggestionStore()
const i18n = useI18nStore();
const listStore = useListStore();

const route = useRoute();
const listId = parseInt(route.params.id as string)

onMounted(async () => {
  loading.value = true;
  await fetchItems(listId);
  await suggestionStore.fetchSuggestions();
  loading.value = false;
})

const newItem = ref('');
const loading = ref(true);
const processing = ref<Set<string>>(new Set());

function isInListUnchecked(name: string) {
  return items.value.some(listItem => listItem.name.toLowerCase() === name.toLowerCase() && !listItem.checked);
}

// Helper function to get the list item for a suggestion (reactive)
function getListItem(name: string) {
  return items.value.find(listItem => listItem.name.toLowerCase() === name.toLowerCase() && !listItem.checked);
}

async function toggleSuggestion(name: string) {
  const key = name.toLowerCase();
  if (processing.value.has(key)) return;
  processing.value.add(key);
  try {
    const found = items.value.find(listItem => listItem.name.toLowerCase() === key && !listItem.checked);
    if (found) {
      // Item already in list (unchecked) => decrease/remove
      await clearItem(found);
    } else {
      // Not in list => add
      await addItem(name, listId);
    }
  } finally {
    processing.value.delete(key);
    newItem.value = '';
  }
}

const filteredSuggestions = computed(() => {
  // Get all item names from the current list with their prices
  const allItemsFromList = items.value.map(item => ({
    name: item.name,
    unit_price: item.unit_price || null
  }));

  // Combine and deduplicate suggestions (list items take priority for price)
  const allSuggestions = [...allItemsFromList, ...suggestionStore.combinedSuggestions];
  const seen = new Set<string>();
  const uniqueSuggestions = allSuggestions.filter(item => {
    const lower = item.name.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  const suggestions = uniqueSuggestions.filter(item =>
      item.name.toLowerCase().includes(newItem.value.toLowerCase())
  );

  // sort suggestions: unchecked items in list first (by created_at desc), then checked items and items not in list alphabetically
  const sorted = suggestions.sort((a, b) => {
    const aInList = items.value.find(listItem => listItem.name.toLowerCase() === a.name.toLowerCase());
    const bInList = items.value.find(listItem => listItem.name.toLowerCase() === b.name.toLowerCase());

    // Check if items are unchecked (not checked)
    const aUnchecked = aInList && !aInList.checked;
    const bUnchecked = bInList && !bInList.checked;

    // Unchecked items in list will be shown first
    if (aUnchecked && !bUnchecked) return -1;
    if (!aUnchecked && bUnchecked) return 1;

    // if both are unchecked, sort by created_at descending
    if (aUnchecked && bUnchecked) {
      return new Date(bInList.created_at).getTime() - new Date(aInList.created_at).getTime();
    }

    // De rest (checked items of items niet in lijst) alfabetisch sorteren
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const isDuplicate = sorted.some(item => item.name.toLowerCase() === newItem.value.toLowerCase());
  return newItem.value && !isDuplicate ? [{name: newItem.value, checked: false, unit_price: null}, ...sorted] : sorted;
});
</script>

<template>
  <ClientOnly>
    <div class="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden md:pt-16">
      <!-- Fixed Header -->
      <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 touch-none">
        <div class="max-w-4xl mx-auto px-4 py-3">
          <!-- Top Row: Back button, Title, Price -->
          <div class="flex items-center gap-3">
            <!-- Back/Close Button -->
            <button
              @click="emit('close')"
              class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Title & Stats -->
            <div class="flex-1 min-w-0">
              <h1 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                {{ listStore.lists.find((list: any) => list.id == listId)?.name || i18n.t('items.addNew') }}
              </h1>
              <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{{ items.filter(item => !item.checked).length }} {{ i18n.t('list.items') }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span>{{ filteredSuggestions.length }} {{ i18n.t('items.suggestions') }}</span>
              </div>
            </div>

            <!-- Total Price Badge -->
            <div class="flex-shrink-0 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-800">
              <span class="text-sm font-bold text-green-700 dark:text-green-400">
                €{{ items.filter(item => !item.checked).reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Search Input -->
          <div class="mt-3">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="newItem"
                type="text"
                :placeholder="i18n.t('items.addPlaceholder')"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                autofocus
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Content - Scrollable -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div v-if="loading" class="flex items-center justify-center py-16">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <p class="text-slate-500 dark:text-slate-400 text-center text-sm">
              {{ i18n.t('items.noSuggestions') }}
            </p>
          </div>

          <!-- Suggestions List -->
          <div v-else class="space-y-2 pb-20">
            <div
              v-for="item in filteredSuggestions"
              :key="item.name"
              class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 overflow-hidden group"
            >
              <div class="p-3">
                <div class="flex items-center gap-3">
                  <!-- Add/Check Button -->
                  <button
                    @click="toggleSuggestion(item.name)"
                    class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95"
                    :class="isInListUnchecked(item.name)
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md'"
                    :disabled="processing.has(item.name.toLowerCase())"
                  >
                    <svg
                      v-if="isInListUnchecked(item.name)"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>

                  <!-- Product Name & Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight truncate">
                      {{ item.name }}
                    </h3>
                    <div v-if="getListItem(item.name)" class="flex items-center gap-2 mt-0.5">
                      <span class="text-xs text-green-600 dark:text-green-400 font-medium">
                        {{ i18n.t('items.inList') }}
                      </span>
                      <span class="text-xs text-slate-400">•</span>
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        {{ getListItem(item.name)?.quantity }}x · €{{ getListItem(item.name)?.unit_price?.toFixed(2) || '0.00' }}
                      </span>
                    </div>
                    <div v-else-if="item.unit_price" class="mt-0.5">
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        €{{ item.unit_price?.toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Price & Quantity (for items in list) -->
                  <div v-if="getListItem(item.name)" class="flex items-center gap-2">
                    <!-- Total Price -->
                    <div class="text-right mr-1 hidden sm:block">
                      <div class="text-sm font-bold text-slate-900 dark:text-white">
                        €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                      </div>
                    </div>

                    <!-- Compact Quantity Controls -->
                    <div class="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <button
                        @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                        class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-l-lg transition-colors active:scale-95"
                      >
                        <span class="text-lg font-bold">−</span>
                      </button>
                      <span class="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                        {{ getListItem(item.name)?.quantity || 1 }}
                      </span>
                      <button
                        @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                        class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-r-lg transition-colors active:scale-95"
                      >
                        <span class="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') }}</p>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
/* Prevent pull-to-refresh and overscroll */
.fixed.inset-0 {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Prevent touch scrolling on fixed elements */
.touch-none {
  touch-action: none;
  overscroll-behavior: none;
}

/* Allow scrolling only in content area */
.overflow-y-auto {
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
</style>
