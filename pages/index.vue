<script setup lang="ts">
import {useGroceryList} from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'
import ShareListModal from '~/components/ShareListModal.vue';
import deleteModal from '~/components/deleteModal.vue';
import {ref, watch, computed} from 'vue'
import {useAuthStore} from "~/stores/auth";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import { useI18nStore } from '~/stores/i18n';

const listStore = useListStore();
await listStore.fetchLists()

const sortedLists = computed(() => {
  return [...listStore.lists].sort((a, b) => {
    const isAFavorite = a.id === auth?.user?.favorite_list_id;
    const isBFavorite = b.id === auth?.user?.favorite_list_id;
    if (isAFavorite && !isBFavorite) return -1;
    if (!isAFavorite && isBFavorite) return 1;
    return 0;
  });
});

definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
const list = useGroceryList()
const {favorite, shareList, deleteList} = list
const {showNotification, showSuccess} = useNotification();
const i18n = useI18nStore();

const openListForm = ref(false)
const openDropdown = ref<number | null>(null)

const showShareModal = ref(false)
const shareEmail = ref('')
const shareListId = ref<number | null>(null)
const shareListName = ref('')

const showDeleteModal = ref(false)
const deleteListId = ref<number | null>(null)
const deleteListName = ref('')

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

function shareListWithUser(id: number) {
  const list = listStore.lists.find((list: any) => list.id === id);
  shareListId.value = id;
  shareListName.value = list?.name || '';
  shareEmail.value = '';
  showShareModal.value = true;
  openDropdown.value = null;
}

function handleShareConfirm(email: string) {
  if (shareListId.value && email.trim()) {
    shareList(shareListId.value, email).then(() => {
      showSuccess(i18n.t('lists.shared'));
      showShareModal.value = false;
    }).catch((error) => {
      showNotification(error);
    });
  }
}

function closeShareModal() {
  showShareModal.value = false;
  shareEmail.value = '';
  shareListId.value = null;
  shareListName.value = '';
}

function deleteListItem(id: number) {
  const list = listStore.lists.find((list: any) => list.id === id);
  deleteListId.value = id;
  deleteListName.value = list?.name || '';
  showDeleteModal.value = true;
  openDropdown.value = null; // Close the dropdown
}

function handleDeleteConfirm() {
  if (deleteListId.value) {
    deleteList(deleteListId.value).then(() => {
      listStore.removeList(deleteListId.value);
      showDeleteModal.value = false;
      deleteListId.value = null;
      deleteListName.value = '';
    }).catch((error) => {
      showNotification(error);
    });
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteListId.value = null;
  deleteListName.value = '';
}

function makefavorite(id: number | null) {
  favorite(id)
      .then(() => {
        favorite(id);
        showSuccess(i18n.t('lists.favorited'));
      })
      .catch(() => {
        showNotification(i18n.t('errors.listFavoriteFailed'));
      });
}

function setFavoriteList(id: number) {
  let listId = auth?.user?.favorite_list_id == id ? null : id;
  makefavorite(listId)
  openDropdown.value = null; // Close the submenu
  const data = auth.user;
  if (data) {
    data.favorite_list_id = listId;
    auth.setUser(data);
  }
}

function stringToColor(str) {
  // Gebruik een hash om een kleur uit een vaste lijst te kiezen
  const colors = [
    '#6366f1', // indigo-500
    '#2563eb', // blue-600
    '#0ea5e9', // sky-500
    '#22c55e', // green-500
    '#f59e42', // orange-400
    '#f43f5e', // rose-500
    '#eab308', // yellow-500
    '#a21caf', // purple-700
    '#14b8a6', // teal-500
    '#f472b6', // pink-400
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

function calculateProgress(listItem) {
  const checked = listItem.grocery_list_items_checked_count ?? 0;
  const total = listItem.grocery_list_items_count ?? 0;
  if (total === 0) return 0;
  return Math.round((checked / total) * 100);
}

</script>


<template>
  <div class="h-full flex flex-col items-center justify-center w-full max-w-full px-1 sm:px-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light text-center">🛒 {{ i18n.t('lists.title') }}</h1>
    <div v-if="!openListForm" class="flex-1 min-h-0 flex flex-col w-full">
      <ul class="space-y-5 w-full">
        <li
            v-for="listItem in sortedLists"
            :key="listItem.id"
            @click="$router.push(`/list/${listItem.id}`)"
            class="cursor-pointer bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-3 sm:p-5 active:shadow-2xl border border-border-light dark:border-border-dark transition relative hover:shadow-2xl hover:border-accent/60 group w-full"
        >
          <div class="flex items-start justify-between w-full">
             <span class="text-base sm:text-lg font-semibold break-words whitespace-normal">
                <h2>{{ listItem.name }}</h2>
                <span v-if="auth?.user?.favorite_list_id === listItem.id" class="text-yellow-500">⭐</span>
            </span>
            <div class="relative ml-2">
              <button
                  class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent/10 text-accent active:bg-accent/20 transition border border-accent/30 focus:ring-2 focus:ring-accent"
                  @click.stop="toggleDropdown(listItem.id)"
              >
                ⋮
              </button>
              <div
                  v-if="openDropdown === listItem.id"
                  class="dropdown-menu absolute right-0 top-0 z-[99999] w-44 bg-white dark:bg-slate-900 border border-accent/30 dark:border-accent/40 rounded-xl shadow-2xl py-2 flex flex-col gap-1"
                  style="transform: translateY(40px);"
              >
                <button
                    class="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/20 dark:hover:bg-accent/30 transition text-accent dark:text-accent font-semibold"
                    @click.stop="setFavoriteList(listItem.id)"
                >
                  {{ auth?.user?.favorite_list_id === listItem.id ? `❌ ${i18n.t('lists.menu.removeFavorite')}` : `⭐ ${i18n.t('lists.menu.markFavorite')}` }}
                </button>
                <button
                    v-if="listItem.created_by.id == auth.user.id"
                    class="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/20 dark:hover:bg-accent/30 transition text-accent dark:text-accent font-semibold"
                    @click.stop="shareListWithUser(listItem.id)"
                >
                  👥 {{ i18n.t('lists.menu.share') }}
                </button>
                <button
                    v-if="listItem.created_by.id == auth.user.id"
                    class="block w-full text-left px-4 py-3 rounded-lg text-error hover:bg-error/10 dark:hover:bg-error/20 transition font-semibold"
                    @click.stop="deleteListItem(listItem.id)"
                >
                  🗑️ {{ i18n.t('lists.menu.delete') }}
                </button>
              </div>
            </div>
          </div>
          <div class="mt-3 flex items-center space-x-2">
            <div class="flex-1 h-2 bg-accent/10 dark:bg-accent/20 rounded-full overflow-hidden">
              <div
                  class="h-full bg-accent rounded-full transition-all duration-300"
                  :style="{ width: `${calculateProgress(listItem)}%` }"
              ></div>
            </div>
            <div class="text-sm text-gray-600 dark:text-slate-300 min-w-fit">
              {{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }}
            </div>
          </div>
          <div
              v-if="listItem.grocery_list_invites && listItem.grocery_list_invites.length > 0"
              class="flex items-center mt-4 space-x-[-8px]"
          >
            <span
                v-for="invite in listItem.grocery_list_invites"
                :key="invite.user.id"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 text-sm font-bold text-white shadow-md ring-2 ring-accent/30 dark:ring-accent/60"
                :style="{ backgroundColor: stringToColor(invite.user.name) }"
                :title="invite.user.name"
            >
              {{ invite.user.name.charAt(0).toUpperCase() }}
            </span>
            <span
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 text-sm font-bold text-white shadow-md ring-2 ring-primary/30 dark:ring-accent/60"
                :style="{ backgroundColor: stringToColor(listItem.created_by.name) }"
                :title="listItem.created_by.name"
            >
              {{ listItem.created_by.name.charAt(0).toUpperCase() }}
            </span>
          </div>
        </li>
      </ul>
      <button
          v-if="$route.path === '/'"
          class="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-4xl transition md:hidden border-4 border-white dark:border-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800"
        @click="openListForm = true"
      >
        <span class="pb-1">+</span>
      </button>
    </div>
    <div v-else class="flex-1 min-h-0 overflow-y-auto">
      <ListForm @list-added="handleList" @close="openListForm = false" />
    </div>
    <ShareListModal
        :is-visible="showShareModal"
        v-model:email="shareEmail"
        :list-name="shareListName"
        @close="closeShareModal"
        @confirm="handleShareConfirm"
    />
    <deleteModal
        :is-visible="showDeleteModal"
        :title="i18n.t('lists.deleteTitle')"
        :content="i18n.t('lists.confirmDelete')"
        :item-name="deleteListName"
        :delete-button-text="i18n.t('lists.deleteBtn')"
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
    />
  </div>
</template>
