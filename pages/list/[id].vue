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
      <div class="max-w-4xl mx-auto px-4 py-3">
        <!-- Top Row: Back button, Title, Add button -->
        <div class="flex items-center gap-3">
          <!-- Back Button -->
          <NuxtLink
            to="/"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>

          <!-- Title & Stats -->
           <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
              <span>{{ list?.name }}</span>
            </h1>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ uncheckedItems.length }} {{ i18n.t('list.remaining') || 'over' }}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span>{{ checkedItems.length }} {{ i18n.t('list.done') || 'klaar' }}</span>
            </div>
          </div>

          <!-- Total Price Badge -->
          <div class="flex-shrink-0 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-800">
            <span class="text-sm font-bold text-green-700 dark:text-green-400">€{{ totalPrice.toFixed(2) }}</span>
          </div>

          <!-- Add Item Button -->
          <button
            v-if="!showAddItem"
            @click="showAddItem = true"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div v-if="items.length > 0" class="mt-3">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{{ i18n.t('list.progress') || 'Voortgang' }}</span>
            <span class="font-medium">{{ Math.round((checkedItems.length / items.length) * 100) }}%</span>
          </div>
          <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(checkedItems.length / items.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-4 pb-24 pt-4">
      <Loader v-if="loading" />

      <!-- Empty State -->
      <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-col items-center justify-center py-16 px-6">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-5">
          <span class="text-5xl">🛒</span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          {{ i18n.t('items.emptyState.title') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-center text-sm max-w-xs mb-6">
          {{ i18n.t('items.emptyState.message') }}
        </p>
        <button
          @click="showAddItem = true"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>{{ i18n.t('items.addFirst') || 'Voeg item toe' }}</span>
        </button>
      </div>

      <!-- Items List -->
      <div v-else class="space-y-4">
        <div v-if="!showAddItem">
          <!-- Active Items Section -->
          <div v-if="uncheckedItems.length > 0" class="space-y-2">
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

          <!-- All Done State -->
          <div v-else-if="checkedItems.length > 0" class="flex flex-col items-center justify-center py-12 px-6">
            <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl">🎉</span>
            </div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-1 text-center">
              {{ i18n.t('list.allDone') || 'Alles gedaan!' }}
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-center text-sm">
              {{ i18n.t('list.allDoneMessage') || 'Je hebt alle items afgevinkt' }}
            </p>
          </div>

          <!-- Completed Items Section -->
          <div v-if="checkedItems.length > 0" class="mt-6">
            <button
              @click="showCheckedItems = !showCheckedItems"
              class="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="font-medium text-slate-700 dark:text-slate-300">
                  {{ i18n.t('list.completed') || 'Afgerond' }}
                </span>
                <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  {{ checkedItems.length }}
                </span>
              </div>
              <svg
                class="w-5 h-5 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': showCheckedItems }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[2000px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-[2000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="showCheckedItems" class="mt-3 space-y-2 overflow-hidden">
                <transition-group name="list" tag="div" class="space-y-2">
                  <GroceryListItem
                    v-for="item in checkedItems"
                    :key="item.id"
                    :item="item"
                    :isEditing="editingItemId === item.id"
                    @edit="editingItemId = $event"
                    @check="handleCheckItem"
                    @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                    class="opacity-60"
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