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
              class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition"
          >
            <div class="flex items-center flex-1">
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

              <button
                  class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-red-500 text-white rounded-full text-base sm:text-lg font-bold hover:bg-red-600"
                  @click="clearItem(item)"
              >✕
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
                class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition"
            >
              <div class="flex items-center flex-1">
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

                <button
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-red-500 text-white rounded-full text-base sm:text-lg font-bold hover:bg-red-600"
                    @click="clearItem(item)"
                >✕
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