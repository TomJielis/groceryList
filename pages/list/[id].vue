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
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';


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

const handleListRefresh = async (data: { listId: number, userId: number }) => {
  if (data.userId !== authStore.user?.id) {
    await fetchItems(Number(listId));
  }
};

const handleItemChanged = async (_data: { listId: number, item: any }) => {
  await fetchItems(Number(listId));
};

onMounted(async () => {
  if (listId && !isNaN(Number(listId))) {
    loading.value = true;
    try {
      await fetchItems(Number(listId));
    } catch (error) {
      // Errors are handled by the global error interceptor
    } finally {
      loading.value = false;
    }

    connect();
    joinList(Number(listId));
    onListRefresh(handleListRefresh);
    onItemChanged(handleItemChanged);
  }
});

onBeforeUnmount(() => {
  if (listId && !isNaN(Number(listId))) {
    leaveList(Number(listId));
    offListRefresh(handleListRefresh);
    offItemChanged(handleItemChanged);
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
      <div>
        <div class="flex flex-col gap-6">
          <PageHeader
            back-to="/"
            :title="list?.name || ''"
            :subtitle="`${uncheckedItems.length} ${i18n.t('list.remaining')} · ${checkedItems.length} ${i18n.t('list.done')}`"
          >
            <template #actions>
              <div class="flex flex-col sm:flex-row gap-3">
                <Button
                  v-if="showAddItem"
                  :label="i18n.t('common.cancel')"
                  severity="secondary"
                  @click="showAddItem = false"
                />
                <Button
                  v-else
                  icon="pi pi-plus"
                  :label="i18n.t('items.addNew')"
                  severity="primary"
                  @click="showAddItem = true"
                />
              </div>
            </template>
          </PageHeader>

          <div class="grid grid-cols-3 gap-3 pt-4">
            <div class="stat-card-item stat-card-accent-orange">
              <div class="stat-card-label">{{ i18n.t('items.total') }}</div>
              <div class="stat-card-value">€{{ totalPrice.toFixed(2) }}</div>
            </div>
            <div class="stat-card-item stat-card-accent-blue">
              <div class="stat-card-label">{{ i18n.t('list.remaining') }}</div>
              <div class="stat-card-value">{{ uncheckedItems.length }}</div>
            </div>
            <div class="stat-card-item stat-card-accent-green">
              <div class="stat-card-label">{{ i18n.t('list.done') }}</div>
              <div class="stat-card-value">{{ checkedItems.length }}</div>
            </div>
          </div>

          <div v-if="items.length > 0" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs text-surface-500">
              <span>{{ i18n.t('list.progress') }}</span>
              <span>{{ Math.round((checkedItems.length / items.length) * 100) }}%</span>
            </div>
            <ProgressBar :value="Math.round((checkedItems.length / items.length) * 100)" :showValue="false" />
          </div>
        </div>
      </div>

      <div class="pt-4">
        <Loader v-if="loading" />

        <div v-else-if="items.length === 0 && !showAddItem" class="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div class="text-5xl">🛒</div>
          <h2 class="text-xl font-light">
            {{ i18n.t('items.emptyState.title') }}
          </h2>
          <p class="text-sm text-surface-500 max-w-md">
            {{ i18n.t('items.emptyState.message') }}
          </p>
          <Button
            icon="pi pi-plus"
            :label="i18n.t('items.addFirst')"
            severity="primary"
            @click="showAddItem = true"
          />
        </div>

        <div v-else class="space-y-5">
          <div v-if="!showAddItem">
          <!-- Active Items Section -->
          <div v-if="uncheckedItems.length > 0">
            <!-- Desktop Table View -->
            <div class="hidden md:block rounded overflow-hidden">
              <div class="grid grid-cols-12 gap-4 px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400">
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
            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span class="text-3xl">🎉</span>
            </div>
            <h2 class="text-lg font-light mb-1 text-center">
              {{ i18n.t('list.allDone') }}
            </h2>
            <p class="text-surface-500 text-center text-sm">
              {{ i18n.t('list.allDoneMessage') }}
            </p>
          </div>

          <!-- Completed Items Section -->
          <div v-if="checkedItems.length > 0" class="mt-6">
            <button
              @click="showCheckedItems = !showCheckedItems"
              class="w-full flex items-center justify-between py-3 border-t border-surface-200 transition-colors duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded flex items-center justify-center">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-surface-500">
                  {{ i18n.t('list.completed') }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded font-medium">
                  {{ checkedItems.length }}
                </span>
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
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
                <div class="hidden md:block rounded overflow-hidden">
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
          <div v-if="showAddItem" class="rounded overflow-hidden">
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
