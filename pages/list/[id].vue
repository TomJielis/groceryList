<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'; // added onMounted
import {useRoute} from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/groceryListItem.vue';
import {useGroceryList} from '~/composables/useGroceryList';
import {useListStore} from '~/stores/lists';
import {useI18nStore} from '~/stores/i18n';
import AddButton from "~/components/form/addButton.vue";
import Loader from '~/components/Loader.vue';


definePageMeta({
  middleware: ['auth', 'terms'],
});

const listStore = useListStore();
const route = useRoute();
const loading = ref(true);

const listId = route.params.id as string;
const i18n = useI18nStore();

const showAddItem = ref(false);
const showCheckedItems = ref(false);
const editingItemId = ref<number | null>(null);


const {
  items,
  fetchItems,
  updateItem,
  checked,
  decreaseItems,
} = useGroceryList();

onMounted(async () => {
  if (listId && !isNaN(Number(listId))) {
    loading.value = true;
    await fetchItems(Number(listId));
    loading.value = false;
  }
});

const uncheckedItems = computed(() => items.value.filter((item: any) => !item.checked));
const checkedItems = computed(() => items.value.filter((item: any) => item.checked));

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
    // use the decreaseItem function to remove it from the list without losing the price.
    decreaseItems(item);
  } else {
    updateItem(item);
    items.value = items.value.map((i) => (i.id === item.id ? {...i, ...item} : i));
  }
}

console.log(listStore.lists);
const list = listStore.lists.find((list: any) => list.id == parseInt(listId));
</script>
<template>
  <div class="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
    <div class="flex justify-between items-center mb-6 flex-none">
      <h1 class="text-2xl font-bold text-center">🛒 {{ list?.name }}</h1>
      <div class="text-lg font-bold">
        {{ i18n.t('list.total') }}: €{{
          uncheckedItems.reduce((total, item: any) => total + ((item.unit_price || 0) * (item.quantity || 1)), 0).toFixed(2)
        }}
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
</style>