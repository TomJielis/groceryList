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
    <div class="list-add-shell fixed inset-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-6 overflow-hidden">
      <div class="w-full max-w-5xl mx-auto h-full flex flex-col gap-4">
        <div class="list-add-hero shadow-2xl border border-white/10 rounded-3xl">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <button
                @click="emit('close')"
                class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div class="flex-1 min-w-0 text-white">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-300">
                  {{ listStore.lists.find((list: any) => list.id == listId)?.name }}
                </p>
                <h1 class="text-3xl font-bold">
                  {{ i18n.t('items.addNew') }}
                </h1>
              </div>
              <div class="px-4 py-2 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 text-emerald-100 font-semibold">
                €{{ items.filter(item => !item.checked).reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0).toFixed(2) }}
              </div>
            </div>

            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="newItem"
                type="text"
                :placeholder="i18n.t('items.addPlaceholder')"
                class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-amber-300/60 text-white placeholder:text-slate-300"
                autofocus
              />
            </div>
          </div>
        </div>

        <div class="list-add-card flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <div class="list-add-scroll h-full overflow-y-auto px-4 py-4">
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="text-center text-white/80">
                <div class="animate-spin rounded-full h-10 w-10 border-2 border-amber-300 border-t-transparent mx-auto"></div>
                <p class="mt-4 text-sm">{{ i18n.t('common.loading') }}</p>
              </div>
            </div>

            <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-20 text-white space-y-4">
              <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p class="text-slate-200 text-center">
                {{ i18n.t('items.noSuggestions') }}
              </p>
            </div>

            <div v-else class="pb-24 text-white">
            <!-- Section: Items in List -->
            <div v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="mb-6">
              <h3 class="text-xs font-semibold text-slate-200 uppercase tracking-[0.3em] mb-3 px-1">
                {{ i18n.t('items.inList') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block bg-white/5 rounded-2xl border border-white/10">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="flex items-center gap-4 px-4 py-3"
                  :class="{ 'border-b border-white/10': index < filteredSuggestions.filter(i => isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Check Button -->
                  <button
                    @click="toggleSuggestion(item.name)"
                    class="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center transition-transform active:scale-95"
                    :disabled="processing.has(item.name.toLowerCase())"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium text-white">{{ item.name }}</span>
                  </div>

                  <!-- Unit Price -->
                  <div class="w-24 text-right text-sm text-slate-200">
                    €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }}
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/10">
                    <button
                      @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                      class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >−</button>
                    <span class="w-8 text-center font-semibold text-white text-sm">
                      {{ getListItem(item.name)?.quantity || 1 }}
                    </span>
                    <button
                      @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                      class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >+</button>
                  </div>

                  <!-- Total -->
                  <div class="w-20 text-right font-semibold text-white">
                    €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-2">
                <div
                  v-for="item in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="bg-white/5 rounded-2xl border border-white/10 p-3"
                >
                  <div class="flex items-center gap-3">
                    <!-- Check Button -->
                    <button
                      @click="toggleSuggestion(item.name)"
                      class="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center active:scale-95"
                      :disabled="processing.has(item.name.toLowerCase())"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-white truncate text-sm">
                        {{ item.name }}
                      </h3>
                      <p class="text-xs text-slate-200">
                        €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }} × {{ getListItem(item.name)?.quantity }}
                      </p>
                    </div>

                    <!-- Total & Controls -->
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-white">
                        €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                      </span>

                      <div class="flex items-center bg-white/10 rounded-lg border border-white/10">
                        <button
                          @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                          class="w-8 h-8 flex items-center justify-center text-white"
                        >−</button>
                        <span class="w-6 text-center font-bold text-sm text-white">{{ getListItem(item.name)?.quantity || 1 }}</span>
                        <button
                          @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                          class="w-8 h-8 flex items-center justify-center text-white"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Suggestions -->
            <div>
              <h3 v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="text-xs font-semibold text-slate-200 uppercase tracking-[0.3em] mb-3 px-1">
                {{ i18n.t('items.suggestions') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block bg-white/5 rounded-2xl border border-white/10">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => !isInListUnchecked(i.name))"
                  :key="item.name"
                  @click="toggleSuggestion(item.name)"
                  class="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                  :class="{ 'border-b border-white/10': index < filteredSuggestions.filter(i => !isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Add Icon -->
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-300 text-slate-900 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium text-white">{{ item.name }}</span>
                  </div>

                  <!-- Price -->
                  <div class="w-24 text-right text-sm text-slate-200">
                    <span v-if="item.unit_price">€{{ item.unit_price.toFixed(2) }}</span>
                    <span v-else>—</span>
                  </div>

                  <!-- Arrow -->
                  <svg class="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  class="bg-white/5 rounded-2xl border border-white/10 p-3 active:scale-[0.98] transition-all"
                >
                  <div class="flex items-center gap-3">
                    <!-- Add Button -->
                    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-300 text-slate-900 flex items-center justify-center">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-white truncate text-sm">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.unit_price" class="text-xs text-slate-300">
                        €{{ item.unit_price.toFixed(2) }}
                      </p>
                    </div>

                    <!-- Arrow -->
                    <svg class="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
    <template #fallback>
      <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-amber-300 border-t-transparent"></div>
        <p class="mt-4 text-sm text-slate-200">{{ i18n.t('common.loading') }}</p>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.list-add-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.list-add-hero {
  padding: 1.75rem;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.25), rgba(15, 23, 42, 0.9));
  color: #f8fafc;
}

.list-add-card {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
  color: #f8fafc;
}

.list-add-scroll {
  -webkit-overflow-scrolling: touch;
}

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
