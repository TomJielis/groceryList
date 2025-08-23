<script setup lang="ts">
import { useGroceryList } from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore} from "~/stores/auth";

const auth = useAuthStore()
const list = useGroceryList()
const { lists, fetchLists,shareList, deleteList } = list // assuming these methods exist

const openListForm = ref(false)
const openDropdown = ref<number | null>(null)

await fetchLists()

async function handleList() {
  openListForm.value = false
  await fetchLists()
}

function toggleDropdown(id: number) {
  openDropdown.value = openDropdown.value === id ? null : id
}

// Close dropdown if click happens outside
function handleClickOutside(event: MouseEvent) {
  const dropdowns = document.querySelectorAll('.dropdown-menu')
  let clickedInside = false
  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(event.target as Node)) clickedInside = true
  })
  if (!clickedInside) openDropdown.value = null
}

watch(openDropdown, (val) => {
  if (val !== null) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})


function confirmDelete(id: number) {
  console.log(id);
  if (confirm('Are you sure you want to delete this list?')) {
    deleteList(id).then(fetchLists)
  }
}

function shareListWithUser(id: number) {
  // You might want to show a modal here
  const email = prompt('Enter email to share the list with:')
  if (email) {
    shareList(id, 'cynthia@gmail.com').then(() => alert('List shared!'))
  }
}
</script>


<template>
  <div class="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">📋 Your grocery lists</h1>
    <div v-if="!openListForm">
      <ul class="space-y-3">
        <li
            v-for="listItem in lists"
            :key="listItem.id"
            class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative"
        >
          <div class="flex-1 cursor-pointer" @click="$router.push(`/list/${listItem.id}`)">
            <span class="text-base font-medium break-words whitespace-normal">{{ listItem.name }}</span>
          </div>
          <div
              class="ml-3 text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full"
              @click="$router.push(`/list/${listItem.id}`)"
          >
            {{ listItem.grocery_list_items_checked_count }}/{{ listItem.grocery_list_items_count }}
          </div>
          <div class="relative ml-2">
            <button
                class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                @click.stop="toggleDropdown(listItem.id)"
                :class="{ invisible: listItem.created_by !== auth.user.id }"
            >
              ⋮
            </button>

            <div
                v-if="openDropdown === listItem.id"
                class="dropdown-menu absolute right-0 top-12 z-20 w-40 bg-white border rounded-xl shadow-lg"
            >
              <button
                  class="block w-full text-left px-4 py-3 hover:bg-gray-100"
                  @click.stop="shareListWithUser(listItem.id)"
              >
                👥 Share
              </button>
              <button
                  class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"
                  @click.stop="confirmDelete(listItem.id)"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
      <button
          class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition"
          style="padding-bottom: env(safe-area-inset-bottom)"
          @click="openListForm = true"
      >
        ➕
      </button>
    </div>

    <div v-else>
      <ListForm @list-added="handleList" />
    </div>
  </div>
</template>
