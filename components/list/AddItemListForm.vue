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
  // Fetch items and suggestions in parallel for faster loading
  await Promise.all([
    fetchItems(listId),
    suggestionStore.fetchSuggestionsOnly()
  ]);
  loading.value = false;
})

const newItem = ref('');
const loading = ref(true);
const processing = ref<Set<string>>(new Set());

// Create a Map for O(1) lookups instead of repeated .find() calls
const itemsMap = computed(() => {
  const map = new Map<string, typeof items.value[0]>();
  for (const item of items.value) {
    map.set(item.name.toLowerCase(), item);
  }
  return map;
});

function isInListUnchecked(name: string) {
  const item = itemsMap.value.get(name.toLowerCase());
  return item && !item.checked;
}

// Helper function to get the list item for a suggestion (reactive)
function getListItem(name: string) {
  const item = itemsMap.value.get(name.toLowerCase());
  return item && !item.checked ? item : undefined;
}

async function toggleSuggestion(name: string) {
  const key = name.toLowerCase();
  if (processing.value.has(key)) return;
  processing.value.add(key);
  try {
    const found = itemsMap.value.get(key);
    if (found && !found.checked) {
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
  const searchTerm = newItem.value.toLowerCase();
  const map = itemsMap.value;

  // Get all item names from the current list with their prices
  const allItemsFromList = items.value.map(item => ({
    name: item.name,
    unit_price: item.unit_price || null
  }));

  // Combine and deduplicate suggestions (list items take priority for price)
  const allSuggestions = [...allItemsFromList, ...suggestionStore.combinedSuggestions];
  const seen = new Set<string>();
  const uniqueSuggestions: typeof allSuggestions = [];

  for (const item of allSuggestions) {
    const lower = item.name.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueSuggestions.push(item);
    }
  }

  // Filter by search term
  const filtered = searchTerm
    ? uniqueSuggestions.filter(item => item.name.toLowerCase().includes(searchTerm))
    : uniqueSuggestions;

  // Sort suggestions: unchecked items in list first (by created_at desc), then the rest alphabetically
  const sorted = filtered.sort((a, b) => {
    const aItem = map.get(a.name.toLowerCase());
    const bItem = map.get(b.name.toLowerCase());

    const aUnchecked = aItem && !aItem.checked;
    const bUnchecked = bItem && !bItem.checked;

    // Unchecked items in list will be shown first
    if (aUnchecked && !bUnchecked) return -1;
    if (!aUnchecked && bUnchecked) return 1;

    // if both are unchecked, sort by created_at descending
    if (aUnchecked && bUnchecked && aItem && bItem) {
      return new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime();
    }

    // The rest (checked items or items not in list) alphabetically
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const isDuplicate = sorted.some(item => item.name.toLowerCase() === searchTerm);
  return searchTerm && !isDuplicate ? [{name: newItem.value, checked: false, unit_price: null}, ...sorted] : sorted;
});
</script>

<template>
  <ClientOnly>
    <div class="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden md:pt-16">
      <!-- Fixed Header -->
      <div class="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 touch-none">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <!-- Top Row: Back button, Title, Price -->
          <div class="flex items-center gap-4">
            <!-- Back/Close Button -->
            <button
              @click="emit('close')"
              class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Title -->
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-slate-900 dark:text-white truncate">
                {{ i18n.t('items.addNew') }}
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
                {{ listStore.lists.find((list: any) => list.id == listId)?.name }}
              </p>
            </div>

            <!-- Total Price Badge -->
            <div class="flex-shrink-0 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
              <span class="text-sm font-bold text-green-700 dark:text-green-400">
                €{{ items.filter(item => !item.checked).reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Search Input -->
          <div class="mt-4">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="newItem"
                type="text"
                :placeholder="i18n.t('items.addPlaceholder')"
                class="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition text-base font-medium placeholder:text-slate-400"
                autofocus
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Content - Scrollable -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto"></div>
              <p class="mt-4 text-slate-500 dark:text-slate-400 text-sm">{{ i18n.t('common.loading') }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <p class="text-slate-500 dark:text-slate-400 text-center">
              {{ i18n.t('items.noSuggestions') }}
            </p>
          </div>

          <!-- Suggestions List -->
          <div v-else class="pb-24">
            <!-- Section: Items in List -->
            <div v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="mb-6">
              <h3 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                {{ i18n.t('items.inList') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="flex items-center gap-4 px-4 py-3"
                  :class="{ 'border-b border-slate-100 dark:border-slate-700/50': index < filteredSuggestions.filter(i => isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Check Button -->
                  <button
                    @click="toggleSuggestion(item.name)"
                    class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center transition-transform active:scale-95"
                    :disabled="processing.has(item.name.toLowerCase())"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium text-slate-900 dark:text-white">{{ item.name }}</span>
                  </div>

                  <!-- Unit Price -->
                  <div class="w-24 text-right text-sm text-slate-500 dark:text-slate-400">
                    €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }}
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <button
                      @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                      class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >−</button>
                    <span class="w-8 text-center font-semibold text-slate-900 dark:text-white text-sm">
                      {{ getListItem(item.name)?.quantity || 1 }}
                    </span>
                    <button
                      @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                      class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >+</button>
                  </div>

                  <!-- Total -->
                  <div class="w-20 text-right font-semibold text-slate-900 dark:text-white">
                    €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-2">
                <div
                  v-for="item in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3"
                >
                  <div class="flex items-center gap-3">
                    <!-- Check Button -->
                    <button
                      @click="toggleSuggestion(item.name)"
                      class="flex-shrink-0 w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center active:scale-95"
                      :disabled="processing.has(item.name.toLowerCase())"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-slate-900 dark:text-white truncate text-sm">
                        {{ item.name }}
                      </h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }} × {{ getListItem(item.name)?.quantity }}
                      </p>
                    </div>

                    <!-- Total & Controls -->
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900 dark:text-white">
                        €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                      </span>

                      <div class="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <button
                          @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                          class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        >−</button>
                        <span class="w-6 text-center font-bold text-sm">{{ getListItem(item.name)?.quantity || 1 }}</span>
                        <button
                          @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                          class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Suggestions -->
            <div>
              <h3 v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                {{ i18n.t('items.suggestions') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => !isInListUnchecked(i.name))"
                  :key="item.name"
                  @click="toggleSuggestion(item.name)"
                  class="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  :class="{ 'border-b border-slate-100 dark:border-slate-700/50': index < filteredSuggestions.filter(i => !isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Add Icon -->
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium text-slate-900 dark:text-white">{{ item.name }}</span>
                  </div>

                  <!-- Price -->
                  <div class="w-24 text-right text-sm text-slate-500 dark:text-slate-400">
                    <span v-if="item.unit_price">€{{ item.unit_price.toFixed(2) }}</span>
                    <span v-else>—</span>
                  </div>

                  <!-- Arrow -->
                  <svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-2">
                <div
                  v-for="item in filteredSuggestions.filter(i => !isInListUnchecked(i.name))"
                  :key="item.name"
                  @click="toggleSuggestion(item.name)"
                  class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 active:scale-[0.98] transition-all"
                >
                  <div class="flex items-center gap-3">
                    <!-- Add Button -->
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-slate-900 dark:text-white truncate text-sm">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.unit_price" class="text-xs text-slate-500 dark:text-slate-400">
                        €{{ item.unit_price.toFixed(2) }}
                      </p>
                    </div>

                    <!-- Arrow -->
                    <svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
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
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-slate-500 dark:text-slate-400">{{ i18n.t('common.loading') }}</p>
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
