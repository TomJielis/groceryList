<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import GroceryListItem from '~/components/list/groceryListItem.vue';
import {useGroceryList} from '~/composables/useGroceryList';
import {useListStore} from '~/stores/lists';
import {useI18nStore} from '~/stores/i18n';
import AddButton from "~/components/form/addButton.vue";


definePageMeta({
  middleware: ['auth', 'terms'],
});

const listStore = useListStore();
const route = useRoute();
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
} = useGroceryList();

onMounted(async () => {
  if (listId && !isNaN(Number(listId))) {
    await fetchItems(Number(listId));
  }
});

const uncheckedItems = computed(() => items.value.filter((item: any) => !item.checked));
const checkedItems = computed(() => items.value.filter((item: any) => item.checked));


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
  <div class="max-w-2xl mx-auto p-4">

  <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-center">🛒 {{ list?.name }}</h1>
      <div class="text-lg font-bold">
        {{ i18n.t('list.total') }}: €{{
          uncheckedItems.reduce((total, item) => total + ((item.unit_price || 0) * (item.quantity || 1)), 0).toFixed(2)
        }}
      </div>
    </div>
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-16 px-4 pt-60">
      <div class="text-8xl mb-6 opacity-50">📝</div>
      <h2 class="text-2xl font-bold mb-2 text-primary-dark dark:text-accent-light text-center">
        {{ i18n.t('items.emptyState.title') }}
      </h2>
      <p class="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md">
        {{ i18n.t('items.emptyState.message') }}
      </p>
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
      <AddButton  @click="showAddItem = true"/>
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