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
  <div class="list-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-8">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div class="list-hero-card shadow-2xl border border-white/10 rounded-3xl">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-col gap-4">
              <NuxtLink
                to="/"
                class="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </NuxtLink>
              <div>
                <h1 class="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <span>📝</span>
                  <span>{{ list?.name }}</span>
                </h1>
                <p class="text-sm text-slate-300 mt-2">
                  {{ uncheckedItems.length }} {{ i18n.t('list.remaining') || 'over' }} • {{ checkedItems.length }} {{ i18n.t('list.done') || 'klaar' }}
                </p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                v-if="showAddItem"
                @click="showAddItem = false"
                class="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                {{ i18n.t('common.cancel') }}
              </button>
              <button
                v-else
                @click="showAddItem = true"
                class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-300 text-slate-900 font-semibold flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                <span>{{ i18n.t('items.addFirst') || 'Voeg item toe' }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="list-stat-card">
              <p class="text-[11px] uppercase tracking-[0.2em] text-slate-200/80">
                {{ i18n.t('items.total') || 'Totaal' }}
              </p>
              <p class="text-2xl font-bold text-white">€{{ totalPrice.toFixed(2) }}</p>
            </div>
            <div class="list-stat-card">
              <p class="text-[11px] uppercase tracking-[0.2em] text-slate-200/80">
                {{ i18n.t('list.remaining') || 'Over' }}
              </p>
              <p class="text-2xl font-bold text-amber-200">{{ uncheckedItems.length }}</p>
            </div>
            <div class="list-stat-card">
              <p class="text-[11px] uppercase tracking-[0.2em] text-slate-200/80">
                {{ i18n.t('list.done') || 'Klaar' }}
              </p>
              <p class="text-2xl font-bold text-emerald-200">{{ checkedItems.length }}</p>
            </div>
          </div>

          <div v-if="items.length > 0" class="space-y-1">
            <div class="flex items-center justify-between text-xs text-slate-200">
              <span>{{ i18n.t('list.progress') || 'Voortgang' }}</span>
              <span class="font-semibold">{{ Math.round((checkedItems.length / items.length) * 100) }}%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: `${(checkedItems.length / items.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="list-card rounded-3xl shadow-2xl border border-white/10 p-4 md:p-6 text-white">
        <Loader v-if="loading" />

        <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div class="text-5xl">🛒</div>
          <h2 class="text-2xl font-semibold text-white">
            {{ i18n.t('items.emptyState.title') }}
          </h2>
          <p class="text-sm text-slate-200 max-w-md">
            {{ i18n.t('items.emptyState.message') }}
          </p>
          <button
            @click="showAddItem = true"
            class="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold flex items-center gap-2 transition hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>{{ i18n.t('items.addFirst') || 'Voeg item toe' }}</span>
          </button>
        </div>

        <div v-else class="space-y-5">
          <div v-if="!showAddItem">
          <!-- Active Items Section -->
          <div v-if="uncheckedItems.length > 0">
            <!-- Desktop Table View -->
            <div class="hidden md:block bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div class="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-200 uppercase tracking-wider">
                <div class="col-span-5">{{ i18n.t('items.name') }}</div>
                <div class="col-span-2 text-center">{{ i18n.t('items.quantity') }}</div>
                <div class="col-span-2 text-center">{{ i18n.t('items.price') }}</div>
                <div class="col-span-2 text-center">{{ i18n.t('items.total') }}</div>
                <div class="col-span-1"></div>
              </div>
              <transition-group name="list" tag="div">
                <GroceryListItem
                  v-for="item in uncheckedItems"
                  :key="item.id"
                  :item="item"
                  :isEditing="editingItemId === item.id"
                  :tableMode="true"
                  @edit="editingItemId = $event"
                  @check="handleCheckItem"
                  @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                />
              </transition-group>
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden space-y-2">
              <transition-group name="list" tag="div" class="space-y-2">
                <GroceryListItem
                  v-for="item in uncheckedItems"
                  :key="item.id"
                  :item="item"
                  :isEditing="editingItemId === item.id"
                  @edit="editingItemId = $event"
                  @check="handleCheckItem"
                  @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                />
              </transition-group>
            </div>
          </div>

          <!-- All Done State -->
          <div v-else-if="checkedItems.length > 0" class="flex flex-col items-center justify-center py-12 px-6">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-400/30 to-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl">🎉</span>
            </div>
            <h2 class="text-lg font-bold text-white mb-1 text-center">
              {{ i18n.t('list.allDone') || 'Alles gedaan!' }}
            </h2>
            <p class="text-slate-200 text-center text-sm">
              {{ i18n.t('list.allDoneMessage') || 'Je hebt alle items afgevinkt' }}
            </p>
          </div>

          <!-- Completed Items Section -->
          <div v-if="checkedItems.length > 0" class="mt-6">
            <button
              @click="showCheckedItems = !showCheckedItems"
              class="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200 group border border-white/10"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="font-medium text-white">
                  {{ i18n.t('list.completed') || 'Afgerond' }}
                </span>
                <span class="text-xs bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  {{ checkedItems.length }}
                </span>
              </div>
              <svg
                class="w-5 h-5 text-slate-200 transition-transform duration-200"
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
              <div v-if="showCheckedItems" class="mt-3 overflow-hidden">
                <!-- Desktop Table View -->
                <div class="hidden md:block bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <transition-group name="list" tag="div">
                    <GroceryListItem
                      v-for="item in checkedItems"
                      :key="item.id"
                      :item="item"
                      :isEditing="editingItemId === item.id"
                      :tableMode="true"
                      @edit="editingItemId = $event"
                      @check="handleCheckItem"
                      @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
                    />
                  </transition-group>
                </div>

                <!-- Mobile Card View -->
                <div class="md:hidden space-y-2">
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
          <div v-if="showAddItem" class="bg-slate-900/40 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            <AddItemListForm @item-added="handleItemAdded" @close="closeAddItemListForm" />
          </div>
        </transition>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.list-hero-card {
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.25), rgba(15, 23, 42, 0.9));
  padding: 2rem;
}

.list-stat-card {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1.2rem;
  padding: 0.9rem 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.list-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.list-card table {
  width: 100%;
  color: #f8fafc;
}

@media (max-width: 768px) {
  .list-hero-card {
    padding: 1.5rem;
  }
}
</style>
