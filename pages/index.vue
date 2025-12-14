<script setup lang="ts">
import {useGroceryList} from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'
import ShareListModal from '~/components/ShareListModal.vue';
import deleteModal from '~/components/deleteModal.vue';
import {ref, watch, computed, onMounted, onBeforeUnmount} from 'vue'
import {useAuthStore} from "~/stores/auth";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import { useI18nStore } from '~/stores/i18n';
import { useSocket } from '~/composables/useSocket';

const listStore = useListStore();
const loading = ref(true);
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

const { connect, onListRefresh, onItemChanged, offListRefresh, offItemChanged, joinList, leaveList } = useSocket();

onMounted(async () => {
  loading.value = true;
  try {
    await listStore.fetchLists();
  } catch (error) {
    // Errors are handled by the global error interceptor
    loading.value = false;
  }
  loading.value = false;

  // Connect to Socket.io and join all list rooms so index can receive progress updates
  connect();
  listStore.lists.forEach((l: any) => {
    if (l?.id) joinList(Number(l.id));
  });

  const refreshLists = async () => {
    // Re-fetch lists to update counts and progress bars
    await listStore.fetchLists();
  };

  onListRefresh(async (data: { listId: number }) => {
    // Only refresh affected list; for simplicity re-fetch all
    await refreshLists();
  });

  onItemChanged(async (data: { listId: number }) => {
    await refreshLists();
  });
});

onBeforeUnmount(() => {
  // Leave all joined rooms when leaving index page
  listStore.lists.forEach((l: any) => {
    if (l?.id) leaveList(Number(l.id));
  });
  offListRefresh(() => {});
  offItemChanged(() => {});
})

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
  middleware: ['auth', 'terms'],
  requiresAuth: true,
})


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

function makeFavorite(id: number | null) {
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
  makeFavorite(listId)
  openDropdown.value = null; // Close the submenu
  const data = auth.user;
  if (data) {
    data.favorite_list_id = listId;
    auth.setUser(data);
  }
}

function stringToColor(str) {

  if(!str){
    return 'hsl(0, 0%, 80%)';
  }

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

const editListId = ref<number | null>(null)
function openListSettings(id: number) {
  editListId.value = id;
  openListForm.value = true;
  openDropdown.value = null;
}

</script>


<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm touch-none">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="text-2xl">🛒</span>
              <span>{{ i18n.t('lists.title') || 'Mijn Lijsten' }}</span>
            </h1>
            <div class="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                {{ sortedLists.length }} {{ i18n.t('lists.listCount') || 'lijsten' }}
              </span>
              <span v-if="sortedLists.length > 0" class="w-1 h-1 rounded-full bg-slate-400"></span>
              <span v-if="sortedLists.length > 0" class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ sortedLists.reduce((sum, list) => sum + (list.grocery_list_items_checked_count || 0), 0) }} {{ i18n.t('lists.completed') || 'afgevinkt' }}
              </span>
            </div>
          </div>
          <!-- Add List Button -->
          <button
            v-if="!openListForm"
            @click="openListForm = true"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="max-w-2xl mx-auto px-4 pb-24 pt-6">
        <div v-if="!openListForm">
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="sortedLists.length === 0" class="flex flex-col items-center justify-center py-20 px-6">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span class="text-6xl">🛒</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
              {{ i18n.t('lists.emptyState.title') }}
            </h2>
            <p class="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-8">
              {{ i18n.t('lists.emptyState.message') }}
            </p>
            <button
              @click="openListForm = true"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>{{ i18n.t('lists.createFirst') || 'Maak je eerste lijst' }}</span>
            </button>
          </div>

          <!-- Lists Grid -->
          <div v-else class="space-y-3">
            <div
              v-for="listItem in sortedLists"
              :key="listItem.id"
              @click="$router.push(`/list/${listItem.id}`)"
              class="cursor-pointer bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 group active:scale-98"
            >
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span class="truncate">{{ listItem.name }}</span>
                      <span v-if="auth?.user?.favorite_list_id === listItem.id" class="flex-shrink-0 text-yellow-500">⭐</span>
                    </h3>

                    <!-- Stats Row -->
                    <div class="flex items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        {{ (listItem.grocery_list_items_count || 0) - (listItem.grocery_list_items_checked_count || 0) }} {{ i18n.t('lists.remaining') || 'te doen' }}
                      </span>
                      <span v-if="calculateProgress(listItem) > 0" class="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ calculateProgress(listItem) }}%
                      </span>
                    </div>
                  </div>

                  <!-- Menu Button -->
                  <div class="relative ml-2 flex-shrink-0">
                    <button
                      class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      @click.stop="toggleDropdown(listItem.id)"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>

                    <div
                      v-if="openDropdown === listItem.id"
                      class="dropdown-menu absolute right-0 top-12 z-[99999] w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 flex flex-col"
                    >
                      <button
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                        @click.stop="setFavoriteList(listItem.id)"
                      >
                        <span>{{ auth?.user?.favorite_list_id === listItem.id ? '⭐' : '☆' }}</span>
                        <span>{{ auth?.user?.favorite_list_id === listItem.id ? i18n.t('lists.menu.removeFavorite') : i18n.t('lists.menu.markFavorite') }}</span>
                      </button>
                      <button
                        v-if="listItem.created_by.id == auth.user.id"
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                        @click.stop="openListSettings(listItem.id)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span>{{ i18n.t('lists.menu.edit') }}</span>
                      </button>
                      <button
                        v-if="listItem.created_by.id == auth.user.id"
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                        @click.stop="shareListWithUser(listItem.id)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        <span>{{ i18n.t('lists.menu.share') }}</span>
                      </button>
                      <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                      <button
                        class="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 font-medium flex items-center gap-2"
                        @click.stop="deleteListItem(listItem.id)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        <span>{{ listItem.created_by.id == auth.user.id ? i18n.t('lists.menu.delete') : i18n.t('lists.menu.leave') }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="flex items-center gap-3 mb-3">
                  <div class="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      :style="{ width: `${calculateProgress(listItem)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-fit">
                    {{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }}
                  </span>
                </div>

                <!-- Shared Users -->
                <div v-if="listItem.grocery_list_invites && listItem.grocery_list_invites.length > 0" class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ i18n.t('lists.sharedWith') }}:</span>
                  <div class="flex items-center -space-x-2">
                    <span
                      v-for="invite in listItem.grocery_list_invites.slice(0, 3)"
                      :key="invite.user?.id"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 text-xs font-bold shadow-md hover:scale-110 transition-transform cursor-help"
                      :style="{ backgroundColor: stringToColor(invite?.user?.name), color: '#1e293b' }"
                      :title="invite.user?.name"
                    >
                      {{ invite.user?.name.charAt(0).toUpperCase() ?? '?' }}
                    </span>
                    <span
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 text-xs font-bold shadow-md hover:scale-110 transition-transform cursor-help ring-2 ring-blue-500 dark:ring-blue-400"
                      :style="{ backgroundColor: stringToColor(listItem.created_by.name), color: '#1e293b' }"
                      :title="listItem.created_by.name + ' (eigenaar)'"
                    >
                      {{ listItem.created_by.name.charAt(0).toUpperCase() }}
                    </span>
                    <span
                      v-if="listItem.grocery_list_invites.length > 3"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-md"
                    >
                      +{{ listItem.grocery_list_invites.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List Form -->
        <div v-else class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <ListForm :list-id="editListId" @list-added="handleList" @close="() => { openListForm = false; editListId = null }"/>
        </div>
      </div>
    </div>

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
    :withValidation="true"
    @close="closeDeleteModal"
    @confirm="handleDeleteConfirm"
  />
</template>
