<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import {useSuggestionStore} from '~/stores/suggestions'
import { useI18nStore } from '~/stores/i18n';
import {useListStore} from '~/stores/lists';
import Button from 'primevue/button';

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
    <div class="list-add-shell fixed inset-0 z-50 px-4 pb-6 overflow-hidden" style="background: var(--app-bg)">
      <div class="w-full max-w-5xl mx-auto h-full flex flex-col gap-4">
        <div class="pt-6 pb-4">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <Button
                severity="secondary"
                outlined
                @click="emit('close')"
                class="w-10 h-10 p-0 flex-shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </Button>
              <div class="flex-1 min-w-0">
                <p class="page-eyebrow mb-0.5">
                  {{ listStore.lists.find((list: any) => list.id == listId)?.name }}
                </p>
                <h1 class="page-heading">
                  {{ i18n.t('items.addNew') }}
                </h1>
              </div>
              <div class="px-3 py-1.5 rounded border border-surface-200 text-sm font-medium flex-shrink-0">
                €{{ items.filter(item => !item.checked).reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0).toFixed(2) }}
              </div>
            </div>

            <div class="relative">
              <svg class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="newItem"
                type="text"
                :placeholder="i18n.t('items.addPlaceholder')"
                class="w-full pl-7 pr-0 py-3 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition placeholder:text-surface-300 text-base"
                autofocus
              />
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-hidden">
          <div class="list-add-scroll h-full overflow-y-auto">
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-500 mx-auto"></div>
                <p class="mt-4 text-sm text-surface-500">{{ i18n.t('common.loading') }}</p>
              </div>
            </div>

            <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-20 space-y-4">
              <div class="w-14 h-14 border border-surface-200 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p class="text-surface-500 text-center text-sm">
                {{ i18n.t('items.noSuggestions') }}
              </p>
            </div>

            <div v-else class="pb-24">
            <!-- Section: Items in List -->
            <div v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="mb-6">
              <h3 class="text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-3 px-1 text-surface-400">
                {{ i18n.t('items.inList') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block border border-surface-200 rounded overflow-hidden">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="flex items-center gap-4 px-4 py-3"
                  :class="{ 'border-b border-surface-200': index < filteredSuggestions.filter(i => isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Check Button -->
                  <Button
                    severity="primary"
                    @click="toggleSuggestion(item.name)"
                    :disabled="processing.has(item.name.toLowerCase())"
                    class="flex-shrink-0 w-7 h-7 p-0"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                  </Button>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium">{{ item.name }}</span>
                  </div>

                  <!-- Unit Price -->
                  <div class="w-24 text-right text-sm text-surface-500">
                    €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }}
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center rounded overflow-hidden border border-surface-200">
                    <Button
                      severity="secondary"
                      text
                      @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                      class="w-8 h-8 p-0"
                    >−</Button>
                    <span class="w-8 text-center font-medium text-sm">
                      {{ getListItem(item.name)?.quantity || 1 }}
                    </span>
                    <Button
                      severity="secondary"
                      text
                      @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                      class="w-8 h-8 p-0"
                    >+</Button>
                  </div>

                  <!-- Total -->
                  <div class="w-20 text-right font-medium">
                    €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Mobile Rows -->
              <div class="md:hidden">
                <div
                  v-for="item in filteredSuggestions.filter(i => isInListUnchecked(i.name))"
                  :key="item.name"
                  class="border-b border-surface-200 py-3"
                >
                  <div class="flex items-center gap-3">
                    <!-- Check Button -->
                    <Button
                      severity="primary"
                      @click="toggleSuggestion(item.name)"
                      :disabled="processing.has(item.name.toLowerCase())"
                      class="flex-shrink-0 w-8 h-8 p-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </Button>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium break-words text-sm">
                        {{ item.name }}
                      </h3>
                      <p class="text-xs text-surface-500">
                        €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }} × {{ getListItem(item.name)?.quantity }}
                      </p>
                    </div>

                    <!-- Total & Controls -->
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">
                        €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                      </span>

                      <div class="flex items-center rounded border border-surface-200">
                        <Button
                          severity="secondary"
                          text
                          @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                          class="w-8 h-8 p-0"
                        >−</Button>
                        <span class="w-6 text-center font-medium text-sm">{{ getListItem(item.name)?.quantity || 1 }}</span>
                        <Button
                          severity="secondary"
                          text
                          @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                          class="w-8 h-8 p-0"
                        >+</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Suggestions -->
            <div>
              <h3 v-if="filteredSuggestions.some(item => isInListUnchecked(item.name))" class="text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-3 px-1 text-surface-400">
                {{ i18n.t('items.suggestions') }}
              </h3>

              <!-- Desktop Table -->
              <div class="hidden md:block border border-surface-200 rounded overflow-hidden">
                <div
                  v-for="(item, index) in filteredSuggestions.filter(i => !isInListUnchecked(i.name))"
                  :key="item.name"
                  @click="toggleSuggestion(item.name)"
                  class="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors"
                  :class="{ 'border-b border-surface-200': index < filteredSuggestions.filter(i => !isInListUnchecked(i.name)).length - 1 }"
                >
                  <!-- Add Icon -->
                  <div class="flex-shrink-0 w-7 h-7 rounded border border-surface-200 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>

                  <!-- Product Name -->
                  <div class="flex-1 min-w-0">
                    <span class="font-medium">{{ item.name }}</span>
                  </div>

                  <!-- Price -->
                  <div class="w-24 text-right text-sm text-surface-500">
                    <span v-if="item.unit_price">€{{ item.unit_price.toFixed(2) }}</span>
                    <span v-else class="text-surface-300">—</span>
                  </div>

                  <!-- Arrow -->
                  <svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              <!-- Mobile Rows -->
              <div class="md:hidden">
                <div
                  v-for="item in filteredSuggestions.filter(i => !isInListUnchecked(i.name))"
                  :key="item.name"
                  @click="toggleSuggestion(item.name)"
                  class="border-b border-surface-200 py-3 cursor-pointer active:opacity-70 transition-opacity"
                >
                  <div class="flex items-center gap-3">
                    <!-- Add Button -->
                    <div class="flex-shrink-0 w-8 h-8 rounded border border-surface-200 flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium break-words text-sm">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.unit_price" class="text-xs text-surface-500">
                        €{{ item.unit_price.toFixed(2) }}
                      </p>
                    </div>

                    <!-- Arrow -->
                    <svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div class="fixed inset-0 z-50 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-500"></div>
        <p class="mt-4 text-sm text-surface-500">{{ i18n.t('common.loading') }}</p>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.list-add-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  padding-top: calc(env(safe-area-inset-top, 0px) + 1.5rem);
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
