<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import AddItemListForm from '~/components/list/AddItemListForm.vue';
import {useGroceryList} from '~/composables/useGroceryList';
import {useListStore} from "~/stores/lists";

definePageMeta({
  middleware: 'auth',
});

const listStore = useListStore();

const route = useRoute();
const listId = route.params.id as string;

// UI state
const showAddItem = ref(false);
const showCheckedItems = ref(false);
const pullToRefresh = ref(false); // New state for pull-to-refresh
const startY = ref(0); // Track the starting Y position of the touch

// Composable for grocery list logic
const {
  items,
  fetchItems,
  increaseItems,
  decreaseItems,
  clearItem,
  checked,
} = useGroceryList();

// Fetch list items on page load
await fetchItems(listId);

// Handler after new item is added
function handleItemAdded() {
  showAddItem.value = false;
  fetchItems(listId); // FIXME: Should be reactive in composable ideally
}

const uncheckedItems = computed(() => items.value.filter((item: any) => !item.checked));
const checkedItems = computed(() => items.value.filter((item: any) => item.checked));

// Pull-to-refresh logic
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
    await fetchItems(listId); // Refresh the list
  }
}

const startX = ref(0);

async function closeAddItemListForm() {
  showAddItem.value = false;
  await fetchItems(listId);
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
        <transition-group name="fade" tag="ul" class="space-y-3 mb-20">
          <li
              v-for="item in uncheckedItems"
              :key="item.id"
              class="flex items-center justify-between rounded-xl shadow-sm p-3 active:shadow-xl transition relative overflow-hidden"
          >
            <div class="relative flex items-center flex-1 transition-transform">
              <input
                  type="checkbox"
                  class="h-6 w-6 text-green-600 rounded flex-shrink-0"
                  :checked="item.checked"
                  @change="checked({ ...item, checked: $event.target.checked }); item.checked = $event.target.checked"
              />
              <span
                  class="text-base font-medium break-words whitespace-normal ml-2"
                  :class="{ 'line-through text-gray-500': item.checked }"
              >
                {{ item.name }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                  @click="decreaseItems(item)"
              >
                −
              </button>

              <span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">
                {{ item.quantity || 1 }}
              </span>

              <button
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                  @click="increaseItems(item)"
              >
                +
              </button>
            </div>
          </li>
        </transition-group>
        <p
            v-if="checkedItems.length"
            class="text-center text-gray-700 mt-4 cursor-pointer hover:underline"
            @click="showCheckedItems = !showCheckedItems"
        >
          {{ showCheckedItems ? 'Hide' : 'Show' }} checked items ({{ checkedItems.length }})
        </p>
        <ul v-if="showCheckedItems" class="space-y-3 mt-4">
          <transition-group name="fade" tag="ul" class="space-y-3 mb-20">
            <li
                v-for="item in checkedItems"
                :key="item.id"
                class="flex items-center justify-between rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden"
            >
              <div class="relative flex items-center flex-1 transition-transform">
                <input
                    type="checkbox"
                    class="h-6 w-6 text-green-600 rounded flex-shrink-0"
                    :checked="item.checked"
                    @change="checked({ ...item, checked: $event.target.checked }); item.checked = $event.target.checked"
                />
                <span
                    class="text-base font-medium break-words whitespace-normal ml-2"
                    :class="{ 'line-through text-gray-500': item.checked }"
                >
                  {{ item.name }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                    @click="decreaseItems(item)"
                >
                  −
                </button>

                <span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">
                  {{ item.quantity || 1 }}
                </span>

                <button
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                    @click="increaseItems(item)"
                >
                  +
                </button>
              </div>
            </li>
          </transition-group>
        </ul>
      </ul>
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