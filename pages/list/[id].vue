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
  <div class="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
    <div class="flex justify-between items-center mb-6 flex-none">
      <h1 class="text-2xl font-bold text-center">🛒 {{ list?.name }}</h1>
      <div class="text-lg font-bold">
        {{ i18n.t('list.total') }}: €{{ totalPrice.toFixed(2) }}
      </div>
    </div>
    <Loader v-if="loading" />
    <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <div class="text-8xl mb-6 opacity-50">📝</div>
      <h2 class="text-2xl font-bold mb-2 text-primary-dark dark:text-accent-light">
        {{ i18n.t('items.emptyState.title') }}
      </h2>
      <p class="text-slate-600 dark:text-slate-400 mb-32 max-w-md">
        {{ i18n.t('items.emptyState.message') }}
      </p>
      <AddButton @click="showAddItem = true" />
    </div>

    <div v-else class="flex-1">
      <div v-if="!showAddItem">
        <ul class="space-y-3 mb-20">
          <transition-group name="fade" tag="ul" class="space-y-3 mb-10">
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

          <p
            v-if="checkedItems.length"
            class="text-center text-gray-700 dark:text-gray-300 mt-4 cursor-pointer hover:underline"
            @click="showCheckedItems = !showCheckedItems"
          >
            {{ showCheckedItems ? i18n.t('list.hideChecked') : i18n.t('list.showChecked') }}
            {{ i18n.t('list.checkedItemsSuffix') }} ({{ checkedItems.length }})
          </p>

          <ul v-if="showCheckedItems" class="space-y-3 mt-4">
            <transition-group name="fade" tag="ul" class="space-y-3 mb-20">
              <GroceryListItem
                v-for="item in checkedItems"
                :key="item.id"
                :item="item"
                :isEditing="editingItemId === item.id"
                @edit="editingItemId = $event"
                @check="handleCheckItem"
                @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
              />
            </transition-group>
          </ul>
        </ul>
        <AddButton @click="showAddItem = true" />
      </div>
      <div v-else>
        <AddItemListForm @item-added="handleItemAdded" @close="closeAddItemListForm" />
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