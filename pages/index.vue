<script setup lang="ts">
import {useGroceryList} from '~/composables/useGroceryList'
import ListForm from '~/components/list/ListForm.vue'
import ShareListModal from '~/components/ShareListModal.vue';
import deleteModal from '~/components/deleteModal.vue';
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from "~/stores/auth";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import { useI18nStore } from '~/stores/i18n';
import { useSocket } from '~/composables/useSocket';
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Menu from 'primevue/menu'
import Skeleton from 'primevue/skeleton'
import type { MenuItem } from 'primevue/menuitem'

const listStore = useListStore();
const loading = ref(true);
const auth = useAuthStore()
const list = useGroceryList()
const {favorite, shareList, deleteList} = list
const {showNotification, showSuccess} = useNotification();
const i18n = useI18nStore();

const openListForm = ref(false)
const actionMenu = ref<any>(null)
const activeMenuList = ref<any | null>(null)

const showShareModal = ref(false)
const shareEmail = ref('')
const shareListId = ref<number | null>(null)
const shareListName = ref('')

const showDeleteModal = ref(false)
const deleteListId = ref<number | null>(null)
const deleteListName = ref('')

const { connect, onListRefresh, onItemChanged, offListRefresh, offItemChanged, joinList, leaveList } = useSocket();
const router = useRouter();

const handleListRefresh = async (_data: { listId: number; userId: number }) => {
  await listStore.fetchLists();
};

const handleItemChanged = async (_data: { listId: number; item: any }) => {
  await listStore.fetchLists();
};

onMounted(async () => {
  loading.value = true;
  try {
    await listStore.fetchLists();
  } catch (error) {
    // Errors are handled by the global error interceptor
  } finally {
    loading.value = false;
  }

  connect();
  listStore.lists.forEach((l: any) => {
    if (l?.id) joinList(Number(l.id));
  });

  onListRefresh(handleListRefresh);
  onItemChanged(handleItemChanged);
});

onBeforeUnmount(() => {
  listStore.lists.forEach((l: any) => {
    if (l?.id) leaveList(Number(l.id));
  });
  offListRefresh(handleListRefresh);
  offItemChanged(handleItemChanged);
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
  closeListForm();
}

function closeListForm() {
  openListForm.value = false;
  editListId.value = undefined;
}

const actionMenuItems = computed<MenuItem[]>(() => {
  const current = activeMenuList.value;
  if (!current) return [];

  const isFavorite = auth?.user?.favorite_list_id === current.id;
  const isOwner = current?.created_by?.id === auth.user?.id;

  const items: MenuItem[] = [
    {
      label: isFavorite ? i18n.t('lists.menu.removeFavorite') : i18n.t('lists.menu.markFavorite'),
      icon: isFavorite ? 'pi pi-star-fill' : 'pi pi-star',
      command: () => setFavoriteList(current.id)
    }
  ];

  if (isOwner) {
    items.push(
      {
        label: i18n.t('lists.menu.edit'),
        icon: 'pi pi-pencil',
        command: () => openListSettings(current.id)
      },
      {
        label: i18n.t('lists.menu.share'),
        icon: 'pi pi-share-alt',
        command: () => shareListWithUser(current.id)
      }
    );
  }

  items.push({ separator: true });
  items.push({
    label: isOwner ? i18n.t('lists.menu.delete') : i18n.t('lists.menu.leave'),
    icon: 'pi pi-trash',
    command: () => deleteListItem(current.id),
    class: 'menu-item-danger'
  });

  return items;
});

function openActionMenu(event: MouseEvent, listItem: any) {
  activeMenuList.value = listItem;
  actionMenu.value?.toggle(event);
}

function closeActionMenu() {
  actionMenu.value?.hide();
}

function shareListWithUser(id: number) {
  const list = listStore.lists.find((list: any) => list.id === id);
  shareListId.value = id;
  shareListName.value = list?.name || '';
  shareEmail.value = '';
  showShareModal.value = true;
  closeActionMenu();
}

function handleShareConfirm(email: string) {
  if (shareListId.value && email.trim()) {
    shareList(shareListId.value, email).then(async () => {
      showSuccess(i18n.t('lists.shared'));
      await listStore.fetchLists();
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
  closeActionMenu();
}

function handleDeleteConfirm() {
  if (deleteListId.value) {
    deleteList(deleteListId.value).then(() => {
      listStore.removeList(deleteListId.value!);
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

async function setFavoriteList(id: number) {
  const listId = auth?.user?.favorite_list_id == id ? null : id;
  closeActionMenu();
  try {
    await favorite(listId);
    const data = auth.user;
    if (data) {
      data.favorite_list_id = listId;
      auth.setUser(data);
    }
    showSuccess(i18n.t('lists.favorited'));
  } catch {
    showNotification(i18n.t('errors.listFavoriteFailed'));
  }
}

function stringToColor(str: string | null | undefined) {
  if (!str) return 'hsl(0, 0%, 80%)';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 85%)`;
}

function calculateProgress(listItem: any) {
  const checked = listItem.grocery_list_items_checked_count ?? 0;
  const total = listItem.grocery_list_items_count ?? 0;
  if (total === 0) return 0;
  return Math.round((checked / total) * 100);
}

function getRemainingCount(listItem: any) {
  return (listItem.grocery_list_items_count || 0) - (listItem.grocery_list_items_checked_count || 0);
}

const editListId = ref<number | undefined>(undefined)
function openListSettings(id: number) {
  editListId.value = id;
  openListForm.value = true;
  closeActionMenu();
}
</script>

<template>
  <div class="lists-shell px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-surface-200">
        <div class="space-y-1">
          <h1 class="page-heading">{{ i18n.t('lists.title') }}</h1>
          <p class="text-sm text-surface-500">
            {{ sortedLists.length }} {{ i18n.t('lists.listCount') }}
          </p>
        </div>
        <div class="flex gap-3">
          <Button
            v-if="openListForm"
            icon="pi pi-times"
            :label="i18n.t('common.cancel')"
            severity="secondary"
            @click="closeListForm"
          />
          <Button
            v-else
            icon="pi pi-plus"
            :label="i18n.t('lists.newList')"
            severity="primary"
            @click="() => { editListId = undefined; openListForm = true }"
          />
        </div>
      </div>

      <!-- List Form -->
      <div v-if="openListForm" class="py-4">
        <ListForm
          :list-id="editListId"
          @list-added="handleList"
          @close="closeListForm"
        />
      </div>

      <div v-else class="py-4">

        <!-- Loading -->
        <div v-if="loading" class="space-y-1 divide-y divide-surface-100">
          <div v-for="i in 4" :key="i" class="py-4 flex items-center gap-3">
            <div class="flex-1 space-y-2">
              <Skeleton height="1rem" width="40%" class="rounded" />
              <Skeleton height="0.7rem" width="22%" class="rounded" />
            </div>
            <Skeleton height="0.375rem" width="30%" class="rounded-full hidden md:block" />
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="sortedLists.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div class="text-5xl">🛒</div>
          <h2 class="text-2xl font-light">{{ i18n.t('lists.emptyState.title') }}</h2>
          <p class="text-sm text-surface-500 max-w-md">{{ i18n.t('lists.emptyState.message') }}</p>
          <Button
            icon="pi pi-plus"
            :label="i18n.t('lists.createFirst')"
            severity="primary"
            @click="() => { editListId = undefined; openListForm = true }"
          />
        </div>

        <!-- Lists -->
        <div v-else>

          <!-- Column headers (desktop) -->
          <div class="hidden md:flex items-center gap-3 pb-3 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 border-b border-surface-100">
            <div class="flex-1">{{ i18n.t('lists.name') }}</div>
            <div class="w-48 text-center">{{ i18n.t('list.progress') }}</div>
            <div class="w-24 text-center">{{ i18n.t('lists.items') }}</div>
            <div class="w-24 text-center">{{ i18n.t('lists.sharedWith') }}</div>
            <div class="w-9 flex-shrink-0"></div>
          </div>

          <div class="divide-y divide-surface-100">
            <div
              v-for="listItem in sortedLists"
              :key="listItem.id"
              class="py-4 cursor-pointer"
              @click="router.push(`/list/${listItem.id}`)"
            >
              <div class="flex items-center gap-3">

                <!-- Name + creator -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-medium truncate">{{ listItem.name }}</span>
                    <svg
                      v-if="auth?.user?.favorite_list_id === listItem.id"
                      class="w-3 h-3 text-amber-400 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p class="text-xs text-surface-500 mt-0.5">{{ listItem.created_by.name }}</p>
                </div>

                <!-- Progress (desktop) -->
                <div class="hidden md:flex items-center gap-3 w-48">
                  <ProgressBar class="flex-1" :value="calculateProgress(listItem)" :showValue="false" />
                  <span class="text-sm text-surface-500 w-8 text-right">{{ calculateProgress(listItem) }}%</span>
                </div>

                <!-- Item count (desktop) -->
                <div class="hidden md:block text-sm w-24 text-center">
                  <span class="font-medium">{{ getRemainingCount(listItem) }}</span>
                  <span class="text-surface-300 mx-0.5">/</span>
                  <span class="text-surface-500">{{ listItem.grocery_list_items_count ?? 0 }}</span>
                </div>

                <!-- Shared with (desktop) -->
                <div class="hidden md:flex items-center justify-center w-24">
                  <div v-if="listItem.grocery_list_invites?.length" class="flex -space-x-1.5">
                    <span
                      v-for="invite in listItem.grocery_list_invites.slice(0, 3)"
                      :key="invite.user?.id"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-white text-[10px] font-semibold"
                      :style="{ backgroundColor: stringToColor(invite?.user?.name) }"
                    >{{ invite.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}</span>
                    <span
                      v-if="listItem.grocery_list_invites.length > 3"
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-surface-200 text-[10px] font-semibold text-surface-600"
                    >+{{ listItem.grocery_list_invites.length - 3 }}</span>
                  </div>
                  <span v-else class="text-sm text-surface-300">—</span>
                </div>

                <!-- Menu -->
                <Button
                  icon="pi pi-ellipsis-v"
                  text
                  rounded
                  severity="secondary"
                  class="flex-shrink-0"
                  @click.stop="openActionMenu($event, listItem)"
                />
              </div>

              <!-- Mobile: progress + meta below -->
              <div class="md:hidden mt-3 space-y-1.5">
                <div class="flex justify-between text-xs text-surface-500">
                  <span>{{ getRemainingCount(listItem) }} {{ i18n.t('lists.remaining') }}</span>
                  <span>{{ calculateProgress(listItem) }}%</span>
                </div>
                <ProgressBar :value="calculateProgress(listItem)" :showValue="false" />
                <div class="flex items-center justify-between text-xs text-surface-500">
                  <span>{{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }} {{ i18n.t('lists.items') }}</span>
                  <div v-if="listItem.grocery_list_invites?.length" class="flex -space-x-1.5">
                    <span
                      v-for="invite in listItem.grocery_list_invites?.slice(0, 3) || []"
                      :key="invite.user?.id"
                      class="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-[9px] font-semibold"
                      :style="{ backgroundColor: stringToColor(invite?.user?.name) }"
                    >{{ invite.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Menu ref="actionMenu" popup :model="actionMenuItems" class="lists-menu min-w-[14rem]" />

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

<style scoped>
.lists-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}

:deep(.menu-item-danger) {
  color: var(--app-error) !important;
}
</style>
