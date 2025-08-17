<script setup lang="ts">
import { ref } from 'vue'
import { useGroceryList } from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'

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

<<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">📋 Your grocery lists</h1>

    <div v-if="!openListForm">
      <ul class="space-y-4">
        <li
          v-for="listItem in lists"
          :key="listItem.id"
          class="group relative flex items-center justify-between border rounded p-4 hover:shadow transition"
        >
          <!-- Left: List name -->
          <div class="flex-1 cursor-pointer" @click="$router.push(`/list/${listItem.id}`)">
            <span class="text-lg font-medium">{{ listItem.name }}</span>
          </div>

          <!-- Middle: Count badge -->
          <div
            class="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            @click="$router.push(`/list/${listItem.id}`)"
          >
            {{ listItem.grocery_list_items_checked_count }} / {{ listItem.grocery_list_items_count }}
          </div>

          <!-- Right: Dropdown trigger -->
          <div class="relative ml-4">
            <button
              class="text-gray-500 hover:text-black px-2 focus:outline-none"
              @click.stop="toggleDropdown(listItem.id)"
            >
              ⋮
            </button>

            <!-- Dropdown -->
            <div
              v-if="openDropdown === listItem.id"
              class="absolute right-0 top-8 z-10 w-40 bg-white border rounded shadow-lg"
            >
              <button
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                @click.stop="shareListWithUser(listItem.id)"
              >
                👥 Share
              </button>
              <button
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                @click.stop="confirmDelete(listItem.id)"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Floating button -->
      <button
        class="fixed bottom-6 right-6 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        @click="openListForm = true"
      >
        ➕ Create new list
      </button>
    </div>

    <div v-else>
      <ListForm @list-added="handleList" />
    </div>
  </div>
</template>
