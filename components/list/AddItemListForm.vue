<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useGroceryList} from '~/composables/useGroceryList';
import {useSuggestionStore} from '~/stores/suggestions'
import { useI18nStore } from '~/stores/i18n';

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

const route = useRoute();
const listId = parseInt(route.params.id as string)

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    fetchItems(listId),
    suggestionStore.fetchSuggestionsOnly()
  ]);
  loading.value = false;
})

const newItem = ref('');
const loading = ref(true);
const processing = ref<Set<string>>(new Set());

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
      await clearItem(found);
    } else {
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

  const allItemsFromList = items.value.map(item => ({
    name: item.name,
    unit_price: item.unit_price || null
  }));

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

  const filtered = searchTerm
    ? uniqueSuggestions.filter(item => item.name.toLowerCase().includes(searchTerm))
    : uniqueSuggestions;

  const sorted = filtered.sort((a, b) => {
    const aItem = map.get(a.name.toLowerCase());
    const bItem = map.get(b.name.toLowerCase());

    const aUnchecked = aItem && !aItem.checked;
    const bUnchecked = bItem && !bItem.checked;

    if (aUnchecked && !bUnchecked) return -1;
    if (!aUnchecked && bUnchecked) return 1;

    if (aUnchecked && bUnchecked && aItem && bItem) {
      return new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime();
    }

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const isDuplicate = sorted.some(item => item.name.toLowerCase() === searchTerm);
  return searchTerm && !isDuplicate ? [{name: newItem.value, checked: false, unit_price: null}, ...sorted] : sorted;
});

const uncheckedTotal = computed(() =>
  items.value
    .filter(item => !item.checked)
    .reduce((sum, item) => sum + ((item.unit_price || 0) * item.quantity), 0)
);

const inListItems = computed(() =>
  filteredSuggestions.value.filter(i => isInListUnchecked(i.name))
);

const suggestionItems = computed(() =>
  filteredSuggestions.value.filter(i => !isInListUnchecked(i.name))
);
</script>

<template>
  <ClientOnly>
    <div class="list-add-shell fixed inset-0 z-50 overflow-hidden" style="background: var(--app-bg)">
      <div class="w-full max-w-5xl mx-auto h-full flex flex-col px-4">

        <!-- Header -->
        <div class="pt-6 pb-5 flex-shrink-0">
          <div class="flex items-center gap-3">
            <button
              @click="emit('close')"
              class="flex-shrink-0 w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-100 active:scale-95 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 class="page-heading flex-1 min-w-0">{{ i18n.t('items.addNew') }}</h1>
            <span v-if="uncheckedTotal > 0" class="text-sm font-medium text-surface-500 flex-shrink-0">
              €{{ uncheckedTotal.toFixed(2) }}
            </span>
          </div>

          <div class="relative mt-5">
            <svg class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="newItem"
              type="text"
              :placeholder="i18n.t('items.addPlaceholder')"
              class="w-full pl-7 py-3 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition placeholder:text-surface-300 text-base"
              autofocus
            />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden">
          <div class="list-add-scroll h-full overflow-y-auto">

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-500"></div>
              <p class="text-sm text-surface-500">{{ i18n.t('common.loading') }}</p>
            </div>

            <!-- Empty state -->
            <div v-else-if="filteredSuggestions.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
              <div class="w-14 h-14 border border-surface-200 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p class="text-sm text-surface-500">{{ i18n.t('items.noSuggestions') }}</p>
            </div>

            <!-- Lists -->
            <div v-else class="pb-24 space-y-6">

              <!-- Items in List -->
              <div v-if="inListItems.length > 0">
                <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 px-1 mb-2">
                  {{ i18n.t('items.inList') }}
                </p>
                <div class="divide-y divide-surface-100">
                  <div
                    v-for="item in inListItems"
                    :key="item.name"
                    class="flex items-center gap-3 py-3"
                  >
                    <!-- In-list indicator -->
                    <div
                      class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style="background: rgba(94,189,138,0.12); color: var(--p-primary-color)"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>

                    <!-- Name -->
                    <div class="flex-1 min-w-0">
                      <span class="font-medium text-sm">{{ item.name }}</span>
                    </div>

                    <!-- Unit price -->
                    <div class="w-16 text-right text-sm text-surface-400">
                      €{{ (getListItem(item.name)?.unit_price || 0).toFixed(2) }}
                    </div>

                    <!-- Quantity controls -->
                    <div class="flex items-center border border-surface-200 rounded">
                      <button
                        class="w-7 h-7 flex items-center justify-center text-surface-500 hover:text-surface-900 transition-colors"
                        @click.stop="() => { const found = getListItem(item.name); if (found) decreaseItems(found); }"
                      >−</button>
                      <span class="w-7 text-center text-sm font-medium select-none">{{ getListItem(item.name)?.quantity || 1 }}</span>
                      <button
                        class="w-7 h-7 flex items-center justify-center text-surface-500 hover:text-surface-900 transition-colors"
                        @click.stop="() => { const found = getListItem(item.name); if (found) increaseItems(found); }"
                      >+</button>
                    </div>

                    <!-- Total -->
                    <div class="w-16 text-right text-sm font-medium">
                      €{{ ((getListItem(item.name)?.unit_price || 0) * (getListItem(item.name)?.quantity || 1)).toFixed(2) }}
                    </div>

                    <!-- Remove -->
                    <button
                      @click="toggleSuggestion(item.name)"
                      :disabled="processing.has(item.name.toLowerCase())"
                      class="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-surface-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Suggestions -->
              <div>
                <p v-if="inListItems.length > 0" class="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 px-1 mb-2">
                  {{ i18n.t('items.suggestions') }}
                </p>
                <div class="divide-y divide-surface-100">
                  <div
                    v-for="item in suggestionItems"
                    :key="item.name"
                    @click="toggleSuggestion(item.name)"
                    class="flex items-center gap-3 py-3 cursor-pointer group"
                  >
                    <!-- Add icon -->
                    <div class="flex-shrink-0 w-7 h-7 rounded-full border border-surface-200 group-hover:border-surface-300 flex items-center justify-center text-surface-400 group-hover:text-surface-600 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>

                    <!-- Name -->
                    <div class="flex-1 min-w-0">
                      <span class="text-sm font-medium group-hover:text-surface-900 transition-colors">{{ item.name }}</span>
                    </div>

                    <!-- Price -->
                    <span v-if="item.unit_price" class="text-sm text-surface-400">€{{ item.unit_price.toFixed(2) }}</span>
                    <span v-else class="text-sm text-surface-200">—</span>

                    <!-- Chevron -->
                    <svg class="flex-shrink-0 w-4 h-4 text-surface-300 group-hover:text-surface-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-500"></div>
        <p class="text-sm text-surface-500">{{ i18n.t('common.loading') }}</p>
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
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
</style>
