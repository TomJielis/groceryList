<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/groceryListItem.vue';
import {useGroceryList} from '~/composables/useGroceryList';
import {useListStore} from '~/stores/lists';
import {useI18nStore} from '~/stores/i18n';

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

onMounted(async () => {
  if (listId && !isNaN(Number(listId))) {
    await fetchItems(Number(listId));
  }
});

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
  updateItem(item)
  items.value = items.value.map((i) => (i.id === item.id ? {...i, ...item} : i));
}

const list = listStore.lists.find((list: any) => list.id == parseInt(listId));
</script>
<template>
  <div
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      class="w-full max-w-full px-1 sm:px-4"
  >
    <div
      v-if="!showAddItem"
    >
      <div class="flex justify-between items-center mb-4 w-full top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <h1 class="text-2xl font-bold">🛒 {{ list?.name }}</h1>
        <div class="text-lg font-bold">
          €{{
            uncheckedItems.reduce((total, item) => total + ((item.unit_price || 0) * (item.quantity || 1)), 0).toFixed(2)
          }}
        </div>
      </div>
      <div class="flex-1 min-h-0 flex flex-col overflow-y-auto w-full">
        <ul class="space-y-3 mb-28 w-full">
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
            {{ showCheckedItems ? i18n.t('list.hideChecked') : i18n.t('list.showChecked') }}
            {{ i18n.t('list.checkedItemsSuffix') }} ({{ checkedItems.length }})
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
            class="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-4xl transition md:hidden border-4 border-white dark:border-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800"
            @click="showAddItem = true"
        >
          <span class="pb-1">+</span>
        </button>
      </div>
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