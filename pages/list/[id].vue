<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/groceryListItem.vue';
import { useGroceryList } from '~/composables/useGroceryList';
import { useListStore } from '~/stores/lists';
import { useI18nStore } from '~/stores/i18n';

definePageMeta({
  middleware: 'auth',
});

const listStore = useListStore();
const route = useRoute();
const listId = route.params.id as string;
const i18n = useI18nStore();

const showAddItem = ref(false);
const showCheckedItems = ref(false);
const editingItemId = ref<number | null>(null);

const pullToRefresh = ref(false);
const startY = ref(0);

const {
  items,
  fetchItems,
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

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">🛒 {{ list?.name }}</h1>
      <div class="text-lg font-bold">
        {{ i18n.t('list.total') }}: €{{
          uncheckedItems.reduce((total, item) => total + ((item.unit_price || 0) * (item.quantity || 1)), 0).toFixed(2)
        }}
      </div>
    </div>
    <div v-if="!showAddItem">
      <!-- UNCHECKED ITEMS -->
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
          {{ showCheckedItems ? i18n.t('list.hideChecked') : i18n.t('list.showChecked') }} {{ i18n.t('list.checkedItemsSuffix') }} ({{ checkedItems.length }})
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
      <button
          class="fixed right-4 bottom-24 md:bottom-4 z-50 bg-blue-500 text-white rounded-full w-16 h-16 shadow-lg"
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