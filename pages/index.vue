<script setup lang="ts">
import {useGroceryList} from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import {useAuthStore} from "~/stores/auth";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";

const listStore = useListStore();
await listStore.fetchLists()

definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
const list = useGroceryList()
const {favorite, shareList, deleteList} = list
const {showNotification} = useNotification();

const openListForm = ref(false)
const openDropdown = ref<number | null>(null)

function handleList() {
  openListForm.value = false
}

function toggleDropdown(id: number) {
  openDropdown.value = openDropdown.value === id ? null : id
}

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


async function confirmDelete(id: number) {
  if (confirm('Weet je zeker dat je deze lijst wilt verwijderen?')) {
    deleteList(id).then(async () => {
      listStore.removeList(id);
    }).catch((error) => {
      showNotification(error);
    });
  }
}

function shareListWithUser(id: number) {
  // You might want to show a modal here
  const email = prompt('Voer een e-mailadres in om de lijst mee te delen:')
  if (email) {
    shareList(id, email).then(() => alert('Lijst is gedeeld!'))
  }
}

function makefavorite(id: number | null) {
  favorite(id)
      .then(() => {
        favorite(id);
        alert(`Lijst als favoriet gemarkeerd!`)
      })
      .catch((error) => {
        showNotification(error);
      });
}

function setFavoriteList(id: number) {
  let listId = auth?.user?.favorite_list_id == id ? null : id;
  makefavorite(listId)
  const data = auth.user;
  if (data) {
    data.favorite_list_id = listId;
    auth.setUser(data);
  }
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 85%)`;
}

function calculateProgress(listItem) {
  const checked = listItem.grocery_list_items_checked_count ?? 0;
  const total = listItem.grocery_list_items_count ?? 0;
  if (total === 0) return 0;
  return Math.round((checked / total) * 100);
}

</script>


<template>
  <div class="max-w-8xl p-4">
    <h1 class="text-xl font-bold mb-4 text-center">📋 Jouw boodschappenlijsten</h1>

    <div v-if="!openListForm">
      <ul class="space-y-3">
        <li
            v-for="listItem in listStore.lists"
            :key="listItem.id"
            @click="$router.push(`/list/${listItem.id}`)"
            class="cursor-pointer bg-white rounded-xl shadow-sm p-4 active:shadow-md transition relative"
        >
          <div class="flex items-start justify-between ">
            <div>
              <span class="text-base font-medium break-words whitespace-normal">
                {{ listItem.name }}
              </span>
            </div>
            <div class="relative ml-2">
              <button
                  class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                  @click.stop="toggleDropdown(listItem.id)"
              >
                ⋮
              </button>

              <div
                  v-if="openDropdown === listItem.id"
                  class="dropdown-menu absolute right-0 top-12 z-20 w-40 bg-white border rounded-xl shadow-lg"
              >
                <button
                    class="block w-full text-left px-4 py-3 hover:bg-gray-100"
                    @click.stop="setFavoriteList(listItem.id)"
                >
                  {{ auth?.user?.favorite_list_id === listItem.id ? '❌ Verwijder favoriet' : '⭐ Markeer als favoriet' }}
                </button>
                <button
                    v-if="listItem.created_by.id == auth.user.id"
                    class="block w-full text-left px-4 py-3 hover:bg-gray-100"
                    @click.stop="shareListWithUser(listItem.id)"
                >
                  👥 Delen
                </button>
                <button
                    v-if="listItem.created_by.id == auth.user.id"
                    class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"
                    @click.stop="confirmDelete(listItem.id)"
                >
                  🗑️ Verwijder
                </button>
              </div>
            </div>
          </div>
          <div class="mt-3 flex items-center space-x-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                  class="h-full bg-green-500 rounded-full transition-all duration-300"
                  :style="{ width: `${calculateProgress(listItem)}%` }"
              ></div>
            </div>
            <div class="text-sm text-gray-600 min-w-fit">
              {{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }}
            </div>
          </div>
          <div
              v-if="listItem.grocery_list_invites && listItem.grocery_list_invites.length > 0"
              class="flex items-center mt-3 space-x-[-8px]"
          >
            <span
                v-for="invite in listItem.grocery_list_invites"
                :key="invite.user.id"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white text-sm font-semibold text-gray-800 shadow-sm"
                :style="{ backgroundColor: stringToColor(invite.user.name) }"
                :title="invite.user.name"
            >
              {{ invite.user.name.charAt(0).toUpperCase() }}
            </span>
            <span
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white text-sm font-semibold text-gray-800 shadow-sm"
                :style="{ backgroundColor: stringToColor(listItem.created_by.name) }"
                :title="listItem.created_by.name"
            >
              {{ listItem.created_by.name.charAt(0).toUpperCase() }}
            </span>

          </div>
        </li>
      </ul>
      <button
          class="fixed right-4 bottom-24 md:bottom-4 z-50 bg-blue-500 text-white rounded-full w-16 h-16 shadow-lg"
          style="padding-bottom: env(safe-area-inset-bottom)"
          @click="openListForm = true"
      >
        ➕
      </button>
    </div>

    <div v-else>
      <ListForm @list-added="handleList" @close="openListForm = false"/>
    </div>
  </div>
</template>

