<script setup lang="ts">
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import AddItemListForm from '~/components/list/AddItemListForm.vue'
import {useGroceryList} from '~/composables/useGroceryList'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const listId = route.params.id as string

// UI state
const showAddItem = ref(false)
const showCheckedItems = ref(false)

// Composable for grocery list logic
const {
  items,
  fetchItems,
  increaseItems,
  decreaseItems,
  clearItem,
  checked,
} = useGroceryList()

// Fetch list items on page load
await fetchItems(listId)

// Handler after new item is added
function handleItemAdded() {
  showAddItem.value = false
  fetchItems(listId) // FIXME: Should be reactive in composable ideally
}

const uncheckedItems = computed(() => items.value.filter((item: any) => !item.checked))
const checkedItems = computed(() => items.value.filter((item: any) => item.checked))

const startX = ref(0);

function startSwipe(event, item) {
  startX.value = event.touches[0].clientX;
  item.swipeOffset = 0;
}

function moveSwipe(event, item) {
  const currentX = event.touches[0].clientX;
  const deltaX = currentX - startX.value;

  if (deltaX < 0) {
    item.swipeOffset = deltaX; // Alleen naar links swipen
  }
}

function endSwipe(event, item) {
  if (item.swipeOffset < -window.innerWidth / 2) {
    // Als meer dan 50% van de breedte is geswiped, verwijder het item
    clearItem(item);
  } else {
    // Reset swipe
    item.swipeOffset = 0;
  }
}

</script>

<template>
  <div class="max-w-sm p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">🛒 Grocery list</h1>

    <div v-if="!showAddItem">
      <ul class="space-y-3 mb-20">
        <transition-group name="fade" tag="ul" class="space-y-3 mb-20">
          <li
              v-for="item in uncheckedItems"
              :key="item.id"
              class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden"
              @touchstart="startSwipe($event, item)"
              @touchmove="moveSwipe($event, item)"
              @touchend="endSwipe($event, item)"
          >
            <div
                class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity"
                :style="{ opacity: item.swipeOffset < 0 ? 1 : 0 }"
            >
              Verwijderen
            </div>
            <div
                class="relative flex items-center flex-1 transition-transform"
                :style="{ transform: `translateX(${item.swipeOffset || 0}px)` }"
            >
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
              >−
              </button>

              <span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">
                {{ item.quantity || 1 }}
            </span>

              <button
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                  @click="increaseItems(item)"
              >+
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
                class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden"
                @touchstart="startSwipe($event, item)"
                @touchmove="moveSwipe($event, item)"
                @touchend="endSwipe($event, item)"
            >
              <div
                  class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity"
                  :style="{ opacity: item.swipeOffset < 0 ? 1 : 0 }"
              >
                Verwijderen
              </div>
              <div
                  class="relative flex items-center flex-1 transition-transform"
                  :style="{ transform: `translateX(${item.swipeOffset || 0}px)` }"
              >
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
                >−
                </button>

                <span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">
          {{ item.quantity || 1 }}
      </span>

                <button
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300"
                    @click="increaseItems(item)"
                >+
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
      <AddItemListForm @item-added="handleItemAdded" @close="showAddItem = false"/>
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