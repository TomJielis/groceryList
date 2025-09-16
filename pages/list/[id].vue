<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/GroceryListItem.vue';
import { useGroceryList } from '~/composables/useGroceryList';
import { useListStore } from '~/stores/lists';

definePageMeta({
  middleware: 'auth',
});

const listStore = useListStore();
const route = useRoute();
const listId = route.params.id as string;

const showAddItem = ref(false);
const showCheckedItems = ref(false);
const editingItemId = ref<number | null>(null);

const pullToRefresh = ref(false);
const startY = ref(0);

const {
  items,
  fetchItems,
  increaseItems,
  decreaseItems,
  updateItem,
  checked,
} = useGroceryList();

await fetchItems(listId);

const uncheckedItems = computed(() => items.value.filter((item: any) => !item.checked));
const checkedItems = computed(() => items.value.filter((item: any) => item.checked));

function handleTouchStart(event: TouchEvent) {
  startY.value = event.touches[0].clientY;
}

function handleTouchMove(event: TouchEvent) {
  const currentY = event.touches[0].clientY;
  if (currentY - startY.value > 50) {
    pullToRefresh.value = true;
  }
}

async function handleTouchEnd() {
  if (pullToRefresh.value) {
    pullToRefresh.value = false;
    await fetchItems(listId);
  }
}

function handleItemAdded() {
  showAddItem.value = false;
  fetchItems(listId);
}

async function closeAddItemListForm() {
  showAddItem.value = false;
  await fetchItems(listId);
}

async function updateGroceryListItem(item: any) {
  try {
    updateItem(item);
    items.value = items.value.map((i) => (i.id === item.id ? { ...i, ...item } : i));
  } catch (error) {
    console.error('Failed to update item:', error);
  }
}

const list = listStore.lists.find((list: any) => list.id == parseInt(listId));
</script>
<template>
  <div
      class="max-w-8xl p-4 overflow-y-auto"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <h1 class="text-2xl font-bold mb-4 text-center">🛒 {{ list?.name }}</h1>

    <div v-if="!showAddItem">
      <ul class="space-y-3 mb-20">
        <transition-group name="fade" tag="ul" class="space-y-3 mb-10">
          <GroceryListItem
              v-for="item in uncheckedItems"
              :key="item.id"
              :item="item"
              :isEditing="editingItemId === item.id"
              @edit="editingItemId = $event"
              @check="checked"
              @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
          />
        </transition-group>

        <p
            v-if="checkedItems.length"
            class="text-center text-gray-700 mt-4 cursor-pointer hover:underline"
            @click="showCheckedItems = !showCheckedItems"
        >
          {{ showCheckedItems ? 'Hide' : 'Show' }} checked items ({{ checkedItems.length }})
        </p>

        <!-- CHECKED ITEMS -->
        <ul v-if="showCheckedItems" class="space-y-3 mt-4">
          <transition-group name="fade" tag="ul" class="space-y-3 mb-20">
            <GroceryListItem
                v-for="item in checkedItems"
                :key="item.id"
                :item="item"
                :isEditing="editingItemId === item.id"
                @edit="editingItemId = $event"
                @check="checked"
                @save="(updatedItem) => { updateGroceryListItem(updatedItem); editingItemId = null }"
            />
          </transition-group>
        </ul>
      </ul>
      <div class="text-right text-lg font-bold mt-4">
        Totaal: €{{
          uncheckedItems.reduce((total, item) => total + ((item.unit_price || 0) * (item.quantity || 1)), 0).toFixed(2)
        }}
      </div>
      <button
          class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition"
          @click="showAddItem = true"
      >
        ➕
      </button>
    </div>

    <div v-else>
      <AddItemListForm @item-added="handleItemAdded" @close="closeAddItemListForm"/>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>