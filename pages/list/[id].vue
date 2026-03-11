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
  <div class="list-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div class="py-4 border-b border-[#27272a]">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-col gap-4">
              <NuxtLink
                to="/"
                class="inline-flex w-10 h-10 items-center justify-center rounded border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </NuxtLink>
              <div>
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
                <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">
                  {{ list?.name }}
                </h1>
                <p class="text-sm text-[#71717a] mt-1">
                  {{ uncheckedItems.length }} {{ i18n.t('list.remaining') }} · {{ checkedItems.length }} {{ i18n.t('list.done') }}
                </p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                v-if="showAddItem"
                @click="showAddItem = false"
                class="w-full sm:w-auto px-5 py-2.5 rounded border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition-colors text-sm font-medium"
              >
                {{ i18n.t('common.cancel') }}
              </button>
              <button
                v-else
                @click="showAddItem = true"
                class="w-full sm:w-auto px-5 py-2.5 rounded bg-[#fafafa] text-[#18181b] font-medium flex items-center justify-center gap-2 hover:bg-[#d4d4d8] transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                <span>{{ i18n.t('items.addNew') }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 divide-x divide-[#27272a] border-t border-[#27272a] pt-4">
            <div class="text-center px-3 first:pl-0 last:pr-0">
              <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-1">
                {{ i18n.t('items.total') }}
              </p>
              <p class="text-xl font-light text-[#fafafa]">€{{ totalPrice.toFixed(2) }}</p>
            </div>
            <div class="text-center px-3">
              <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-1">
                {{ i18n.t('list.remaining') }}
              </p>
              <p class="text-xl font-light text-[#a1a1aa]">{{ uncheckedItems.length }}</p>
            </div>
            <div class="text-center px-3 first:pl-0 last:pr-0">
              <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-1">
                {{ i18n.t('list.done') }}
              </p>
              <p class="text-xl font-light text-[#a1a1aa]">{{ checkedItems.length }}</p>
            </div>
          </div>

          <div v-if="items.length > 0" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs text-[#71717a]">
              <span>{{ i18n.t('list.progress') }}</span>
              <span class="text-[#a1a1aa]">{{ Math.round((checkedItems.length / items.length) * 100) }}%</span>
            </div>
            <div class="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
              <div
                class="h-full bg-[#52525b] rounded-full transition-all duration-500"
                :style="{ width: `${(checkedItems.length / items.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4 text-[#fafafa]">
        <Loader v-if="loading" />

        <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div class="text-5xl">🛒</div>
          <h2 class="text-xl font-light text-[#fafafa]">
            {{ i18n.t('items.emptyState.title') }}
          </h2>
          <p class="text-sm text-[#71717a] max-w-md">
            {{ i18n.t('items.emptyState.message') }}
          </p>
          <button
            @click="showAddItem = true"
            class="px-5 py-2.5 bg-[#fafafa] text-[#18181b] rounded font-medium flex items-center gap-2 hover:bg-[#d4d4d8] transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>{{ i18n.t('items.addFirst') }}</span>
          </button>
        </div>

        <div v-else class="space-y-5">
          <div v-if="!showAddItem">
          <!-- Active Items Section -->
          <div v-if="uncheckedItems.length > 0">
            <!-- Desktop Table View -->
            <div class="hidden md:block bg-[#1e1e21] rounded border border-[#27272a] overflow-hidden">
              <div class="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#27272a] text-[0.65rem] font-medium text-[#52525b] uppercase tracking-[0.14em]">
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

            <!-- Mobile List View -->
            <div class="md:hidden">
              <transition-group name="list" tag="div">
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
            <div class="w-16 h-16 bg-[#27272a] rounded-full flex items-center justify-center mb-4">
              <span class="text-3xl">🎉</span>
            </div>
            <h2 class="text-lg font-light text-[#fafafa] mb-1 text-center">
              {{ i18n.t('list.allDone') }}
            </h2>
            <p class="text-[#71717a] text-center text-sm">
              {{ i18n.t('list.allDoneMessage') }}
            </p>
          </div>

          <!-- Completed Items Section -->
          <div v-if="checkedItems.length > 0" class="mt-6">
            <button
              @click="showCheckedItems = !showCheckedItems"
              class="w-full flex items-center justify-between py-3 border-t border-[#27272a] transition-colors duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded bg-[#27272a] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-[#a1a1aa]">
                  {{ i18n.t('list.completed') }}
                </span>
                <span class="text-xs bg-[#27272a] text-[#71717a] px-2 py-0.5 rounded font-medium">
                  {{ checkedItems.length }}
                </span>
              </div>
              <svg
                class="w-4 h-4 text-[#52525b] transition-transform duration-200"
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
                <div class="hidden md:block bg-[#1e1e21] rounded border border-[#27272a] overflow-hidden">
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

                <!-- Mobile List View -->
                <div class="md:hidden">
                  <transition-group name="list" tag="div">
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
          <div v-if="showAddItem" class="bg-[#1e1e21] rounded border border-[#27272a] overflow-hidden">
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
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}

</style>
