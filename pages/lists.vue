<script setup lang="ts">
import { ref } from 'vue'
import { useGroceryList } from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'

const list = useGroceryList()
const { lists, fetchLists } = list

const openListForm = ref(false)

await fetchLists()

async function handleList() {
  openListForm.value = false
  await fetchLists()
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">📋 Your grocery lists</h1>

    <div v-if="!openListForm">
      <ul class="space-y-4">
        <li
            v-for="list in lists"
            :key="list.id"
            class="flex items-center justify-between border rounded p-4 hover:shadow"
            @click="$router.push(`/list/${list.id}`)"
        >
          <span class="text-lg font-medium">{{ list.name }}</span>
          <span
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="$router.push(`/list/${list.id}`)"
          >
            {{ list.grocery_list_items_checked_count }} / {{ list.grocery_list_items_count }}
          </span>
        </li>
      </ul>

      <!-- Floating button -->
      <button
          class="fixed bottom-6 right-6 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          @click="openListForm = true"
      >
        ➕ Nieuwe lijst aanmaken
      </button>
    </div>

    <div v-else>
      <ListForm @list-added="handleList" />
    </div>
  </div>
</template>

