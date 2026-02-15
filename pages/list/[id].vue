<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {useRoute} from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/groceryListItem.vue';
import {useGroceryList} from '~/composables/useGroceryList';
import {useListStore} from '~/stores/lists';
import {useI18nStore} from '~/stores/i18n';
import {useAuthStore} from '~/stores/auth';
import {useSocket} from '~/composables/useSocket';
import AddButton from "~/components/form/addButton.vue";
import Loader from '~/components/Loader.vue';


definePageMeta({
  middleware: ['auth', 'terms'],
});

const listStore = useListStore();
const authStore = useAuthStore();
const route = useRoute();
const loading = ref(true);

const listId = route.params.id as string;
const i18n = useI18nStore();

const showAddItem = ref(false);
const showCheckedItems = ref(false);
const editingItemId = ref<number | null>(null);

// Socket.io for real-time updates
const { connect, joinList, leaveList, onListRefresh, onItemChanged, offListRefresh, offItemChanged, notifyListUpdate } = useSocket();


const {
  items,
  fetchItems,
  updateItem,
  checked,
  decreaseItems,
  totalPrice,
} = useGroceryList();

onMounted(async () => {
  if (listId && !isNaN(Number(listId))) {
    loading.value = true;
    try {
      await fetchItems(Number(listId));
    } catch (error) {
      // Errors are handled by the global error interceptor
      loading.value = false;
    }
    loading.value = false;

    // Connect to Socket.io and join the list room
    console.log('[List Page] Setting up Socket.io connection for list:', listId)
    connect();
    joinList(Number(listId));

    // Listen for real-time updates from other users
    const handleListRefresh = async (data: { listId: number, userId: number }) => {
      console.log('[List Page] 📬 List updated by another user:', data);
      console.log('[List Page] Current user ID:', authStore.user?.id, 'Update from:', data.userId);

      // Only refresh if the update came from a different user
      if (data.userId !== authStore.user?.id) {
        console.log('[List Page] 🔄 Refreshing items...');
        await fetchItems(Number(listId));
      } else {
        console.log('[List Page] ⏭️ Skipping refresh (own update)');
      }
    };

    const handleItemChanged = async (data: { listId: number, item: any }) => {
      console.log('[List Page] 📬 Item changed by another user:', data);
      console.log('[List Page] 🔄 Refreshing items...');
      // Refresh the items to get the latest state
      await fetchItems(Number(listId));
    };

    onListRefresh(handleListRefresh);
    onItemChanged(handleItemChanged);
    console.log('[List Page] ✅ Event listeners registered');
  }
});

onBeforeUnmount(() => {
  // Leave the list room when component unmounts
  if (listId && !isNaN(Number(listId))) {
    leaveList(Number(listId));
    offListRefresh(() => {});
    offItemChanged(() => {});
  }
});


const uncheckedItems = computed(() =>
    items.value
        .filter((item: any) => !item.checked)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
);

const checkedItems = computed(() =>
    items.value
        .filter((item: any) => item.checked)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
);

function handleItemAdded() {
  showAddItem.value = false;
  fetchItems(Number(listId)); // ensure numeric id
}

async function closeAddItemListForm() {
  showAddItem.value = false;
  await fetchItems(Number(listId)); // ensure numeric id
}

async function updateGroceryListItem(item: any) {
  if (item.quantity === 0) {
    // Call decreaseItems to update backend and remove from state
    await decreaseItems(item);
  } else {
    await updateItem(item);
  }
}

async function handleCheckItem(item: any) {
  await checked(item);
}

const list = listStore.lists.find((list: any) => list.id == parseInt(listId));
</script>
<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
              <span class="text-2xl">🛒</span>
              <span>{{ list?.name }}</span>
            </h1>
            <div class="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                {{ uncheckedItems.length }} {{ i18n.t('list.items') || 'items' }}
              </span>
              <span class="w-1 h-1 rounded-full bg-slate-400"></span>
              <span class="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                €{{ totalPrice.toFixed(2) }}
              </span>
            </div>
          </div>
          <!-- Add Item Button -->
          <button
            v-if="!showAddItem"
            @click="showAddItem = true"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-4 pb-24 pt-6">
      <Loader v-if="loading" />

      <!-- Empty State -->
      <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-col items-center justify-center py-20 px-6">
        <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span class="text-6xl">🛒</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
          {{ i18n.t('items.emptyState.title') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-8">
          {{ i18n.t('items.emptyState.message') }}
        </p>
        <button
          @click="showAddItem = true"
          class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>{{ i18n.t('items.addFirst') || 'Add First Item' }}</span>
        </button>
      </div>

      <!-- Items List -->
      <div v-else class="space-y-4">
        <div v-if="!showAddItem">
          <!-- Active Items Section -->
          <div v-if="uncheckedItems.length > 0" class="space-y-3">
            <div class="flex items-center justify-between px-2 mb-3">
              <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {{ i18n.t('list.toBuy') || 'To Buy' }}
              </h3>
              <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                {{ uncheckedItems.length }}
              </span>
            </div>
            <transition-group name="list" tag="div" class="space-y-2">
              <GroceryListItem
                v-for="item in uncheckedItems"
                :key="item.id"
                :item="item"
                :isEditing="editingItemId === item.id"
                @edit="editingItemId = $event"
                @check="handleCheckItem"
                @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                class="transform transition-all duration-200"
              />
            </transition-group>
          </div>

          <!-- Completed Items Section -->
          <div v-if="checkedItems.length > 0" class="mt-8">
            <button
              @click="showCheckedItems = !showCheckedItems"
              class="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200 group"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-90': showCheckedItems }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="font-semibold text-slate-700 dark:text-slate-300">
                  {{ showCheckedItems ? i18n.t('list.hideChecked') : i18n.t('list.showChecked') }}
                </span>
                <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full font-medium">
                  {{ checkedItems.length }}
                </span>
              </div>
              <svg class="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>

            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="showCheckedItems" class="mt-3 space-y-2">
                <transition-group name="list" tag="div" class="space-y-2">
                  <GroceryListItem
                    v-for="item in checkedItems"
                    :key="item.id"
                    :item="item"
                    :isEditing="editingItemId === item.id"
                    @edit="editingItemId = $event"
                    @check="handleCheckItem"
                    @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                    class="opacity-75"
                  />
                </transition-group>
              </div>
            </transition>
          </div>
        </div>

        <!-- Add Item Form -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showAddItem" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <AddItemListForm @item-added="handleItemAdded" @close="closeAddItemListForm" />
          </div>
        </transition>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@supports (height: 100dvh) {
  .min-h-screen { min-height: 100dvh; }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-leave-from, .fade-enter-to {
  opacity: 1;
}
</style>