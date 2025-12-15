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
  decreaseItems
} = useGroceryList();

definePageMeta({
  middleware: ['auth', 'terms'],
});

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

async function addItemToList(itemName: string) {
  const name = itemName.trim();
  if (!name) return;

  await addItem(name, listId);
  newItem.value = '';
}

function isInListUnchecked(name: string) {
  return items.value.some(listItem => listItem.name.toLowerCase() === name.toLowerCase() && !listItem.checked);
}

async function toggleSuggestion(name: string) {
  const key = name.toLowerCase();
  if (processing.value.has(key)) return;
  processing.value.add(key);
  try {
    const found = items.value.find(listItem => listItem.name.toLowerCase() === key && !listItem.checked);
    if (found) {
      // Item already in list (unchecked) => decrease/remove
      await decreaseItems(found);
    } else {
      // Not in list => add
      await addItem(name, listId);
    }
  } finally {
    processing.value.delete(key);
  }
}

const filteredSuggestions = computed(() => {
  // Get all item names from the current list
  const allItemsFromList = items.value.map(item => ({ name: item.name }));

  // Combine and deduplicate suggestions
  const allSuggestions = [...suggestionStore.combinedSuggestions, ...allItemsFromList];
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
  return newItem.value && !isDuplicate ? [{name: newItem.value, checked: false}, ...sorted] : sorted;
});
</script>

<template>
  <ClientOnly>
    <div class="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden md:pt-16">
      <!-- Fixed Header - Same as list detail page -->
      <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 touch-none">
        <div class="max-w-2xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span class="text-2xl">🛒</span>
                <span>{{ listStore.lists.find((list: any) => list.id == listId)?.name || 'Lijst' }}</span>
              </h1>
              <div class="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  {{ items.filter(item => !item.checked).length }} {{ i18n.t('list.items') || 'items' }}
                </span>
                <span class="w-1 h-1 rounded-full bg-slate-400"></span>
                <span class="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  €{{ items.filter(item => !item.checked).reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0).toFixed(2) }}
                </span>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Input - Fixed (match list page spacing + background) -->
      <div class="flex-shrink-0  touch-none">
        <div class="max-w-2xl mx-auto px-4 py-4">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="newItem"
              type="text"
              :placeholder="i18n.t('items.addPlaceholder') || 'Zoek of voeg product toe...'"
              class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              autofocus
            />
          </div>

          <!-- Quick stats -->
          <div v-if="filteredSuggestions.length > 0" class="flex items-center gap-2 mt-3 text-sm text-slate-600 dark:text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>{{ filteredSuggestions.length }} {{ i18n.t('items.suggestions') || 'suggesties' }}</span>
          </div>
        </div>
      </div>

      <!-- Content - Scrollable (match list page spacing + background) -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="max-w-2xl mx-auto px-4 py-4">
          <div v-if="loading" class="flex items-center justify-center py-16">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <p class="text-slate-600 dark:text-slate-400 text-center">
              {{ i18n.t('items.noSuggestions') || 'Geen suggesties gevonden' }}
            </p>
          </div>

          <!-- Suggestions List -->
          <div v-else class="space-y-2">
            <transition-group name="list" tag="div" class="space-y-2 pb-20">
              <div
                v-for="item in filteredSuggestions"
                :key="item.name"
                class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 overflow-hidden group"
              >
                <div class="flex items-center gap-3 p-4">
                  <!-- Add/Check Button -->
                  <button
                    @click="toggleSuggestion(item.name)"
                    class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
                    :class="isInListUnchecked(item.name)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl'"
                    :disabled="processing.has(item.name.toLowerCase())"
                  >
                    <svg
                      v-if="isInListUnchecked(item.name)"
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                    <svg
                      v-else
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ item.name }}
                    </h3>
                    <p
                      v-if="items.some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase() && !listItem.checked)"
                      class="text-sm text-green-600 dark:text-green-400 font-medium mt-0.5"
                    >
                      {{ i18n.t('items.inList') || 'In je lijst' }}
                    </p>
                  </div>

                  <!-- Quantity Controls -->
                  <div
                    v-if="items.some(listItem => listItem.name.toLowerCase() === item.name.toLowerCase() && !listItem.checked)"
                    class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-lg p-1.5"
                  >
                    <button
                      @click="() => { const found = items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()); if (found) decreaseItems(found); }"
                      class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center"
                    >
                      −
                    </button>
                    <span class="min-w-[2rem] text-center text-lg font-bold text-slate-900 dark:text-white">
                      {{ items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase())?.quantity ?? 1 }}
                    </span>
                    <button
                      @click="() => { const found = items.find(listItem => listItem.name.toLowerCase() === item.name.toLowerCase()); if (found) increaseItems(found); }"
                      class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Remove large footer back button to keep controls in header only -->
      <!-- (Footer deleted) -->
    </div>
    <template #fallback>
      <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
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

/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
