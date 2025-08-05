<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddItemListForm from '~/components/list/AddItemListForm.vue'
import { useGroceryList } from '~/composables/useGroceryList'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const listId = route.params.id as string

// UI state
const showAddItem = ref(false)

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
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">🛒 Grocery list</h1>

    <div v-if="!showAddItem">
      <ul class="space-y-3 mb-4">
        <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center justify-between border-b pb-2"
        >
          <input type="checkbox" class="form-checkbox h-5 w-5 text-green-600" :checked="item.checked" @change="checked({ ...item, checked: $event.target.checked })" />
          <span class="font-medium flex-1 ml-2 ml-7">{{ item.name }}</span>
          <div class="flex items-center space-x-2">
            <button
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                @click="decreaseItems(item)"
            >-</button>
            <span class="font-bold">{{ item.quantity || 1 }}</span>
            <button
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                @click="increaseItems(item)"
            >+</button>
            <button
                class="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
                @click="clearItem(item)"
            >X</button>
          </div>
        </li>
      </ul>

      <button
          class="fixed bottom-6 right-6 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          @click="showAddItem = true"
      >
        Create Item
      </button>
    </div>

    <div v-else>
      <AddItemListForm @item-added="handleItemAdded" @close="showAddItem = false" />
    </div>
  </div>
</template>
