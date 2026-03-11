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
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
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

const sharedListsCount = computed(() => {
  return listStore.lists.filter((list: any) => (list?.grocery_list_invites?.length || 0) > 0).length;
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
    class: 'text-red-500'
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

function handleRowNavigate(event: any) {
  const id = event?.data?.id;
  if (id) {
    router.push(`/list/${id}`);
  }
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
  closeActionMenu();
  const data = auth.user;
  if (data) {
    data.favorite_list_id = listId;
    auth.setUser(data);
  }
}

function stringToColor(str: string | null | undefined) {

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

function calculateProgress(listItem: any) {
  const checked = listItem.grocery_list_items_checked_count ?? 0;
  const total = listItem.grocery_list_items_count ?? 0;
  if (total === 0) return 0;
  return Math.round((checked / total) * 100);
}

function getRemainingCount(listItem: any) {
  return (listItem.grocery_list_items_count || 0) - (listItem.grocery_list_items_checked_count || 0);
}

const totalItemsChecked = computed(() => {
  return sortedLists.value.reduce((sum, list) => sum + (list.grocery_list_items_checked_count || 0), 0);
});

const totalItemsRemaining = computed(() => {
  return sortedLists.value.reduce((sum, list) => sum + getRemainingCount(list), 0);
});

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
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-[#27272a]">
        <div class="space-y-1">
          <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
          <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">
            {{ i18n.t('lists.title') }}
          </h1>
          <p class="text-sm text-[#71717a]">
            {{ i18n.t('lists.emptyState.message') }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            v-if="openListForm"
            type="button"
            class="lists-cta secondary"
            @click="closeListForm"
          >
            <i class="pi pi-times"></i>
            <span>{{ i18n.t('common.cancel') }}</span>
          </button>
          <button
            v-else
            type="button"
            class="lists-cta"
            @click="() => { editListId = undefined; openListForm = true }"
          >
            <i class="pi pi-plus"></i>
            <span>{{ i18n.t('lists.newList') }}</span>
          </button>
        </div>
      </div>

      <div v-if="openListForm" class="py-4">
        <ListForm
          :list-id="editListId"
          @list-added="handleList"
          @close="closeListForm"
        />
      </div>

      <div v-else class="py-4">
          <div v-if="loading" class="space-y-3">
            <Skeleton height="48px" class="rounded" />
            <Skeleton height="48px" class="rounded" />
            <Skeleton height="48px" class="rounded" />
          </div>

          <div v-else-if="sortedLists.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div class="text-5xl">🛒</div>
            <h2 class="text-2xl font-light text-[#fafafa]">
              {{ i18n.t('lists.emptyState.title') }}
            </h2>
            <p class="text-sm text-[#71717a] max-w-md">
              {{ i18n.t('lists.emptyState.message') }}
            </p>
            <Button
              icon="pi pi-plus"
              :label="i18n.t('lists.createFirst')"
              @click="() => { editListId = undefined; openListForm = true }"
            />
          </div>

          <div v-else class="space-y-6">
            <div class="md:hidden">
              <div
                v-for="listItem in sortedLists"
                :key="listItem.id"
                class="border-b border-[#27272a] py-4 cursor-pointer"
                @click="router.push(`/list/${listItem.id}`)"
              >
                <div class="flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-[#fafafa] truncate">{{ listItem.name }}</p>
                    <p class="text-xs text-[#71717a] mt-0.5">{{ i18n.t('lists.by') }} {{ listItem.created_by.name }}</p>
                  </div>
                  <Button
                    icon="pi pi-ellipsis-v"
                    text
                    rounded
                    severity="secondary"
                    @click.stop="openActionMenu($event, listItem)"
                  />
                </div>
                <div class="mt-3 space-y-2">
                  <div class="flex justify-between text-xs text-[#71717a]">
                    <span>{{ getRemainingCount(listItem) }} {{ i18n.t('lists.remaining') }}</span>
                    <span class="text-[#a1a1aa]">{{ calculateProgress(listItem) }}%</span>
                  </div>
                  <div class="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                    <div class="h-full bg-[#52525b] rounded-full transition-all duration-500" :style="{ width: `${calculateProgress(listItem)}%` }"></div>
                  </div>
                  <div class="flex items-center justify-between text-xs text-[#71717a]">
                    <span>{{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }} {{ i18n.t('lists.items') }}</span>
                    <div class="flex -space-x-2">
                      <span
                        v-for="invite in listItem.grocery_list_invites?.slice(0, 3) || []"
                        :key="invite.user?.id"
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#18181b] text-[10px] font-semibold"
                        :style="{ backgroundColor: stringToColor(invite?.user?.name), color: '#18181b' }"
                      >
                        {{ invite.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hidden md:block">
              <DataTable
                :value="sortedLists"
                dataKey="id"
                responsiveLayout="stack"
                breakpoint="960px"
                rowHover
                @row-click="handleRowNavigate"
                class="lists-table"
              >
              <template #empty>
                <div class="py-8 text-center text-sm text-[#71717a]">
                  {{ i18n.t('lists.emptyState.message') }}
                </div>
              </template>

              <Column :header="i18n.t('lists.name')">
                <template #body="{ data }">
                  <div class="flex items-center gap-3 min-w-0">
                    <Avatar
                      :icon="auth?.user?.favorite_list_id === data.id ? 'pi pi-star-fill' : 'pi pi-list'"
                      :style="auth?.user?.favorite_list_id === data.id ? 'background:#27272a;color:#fafafa' : 'background:#27272a;color:#a1a1aa'"
                      shape="circle"
                    />
                    <div class="min-w-0">
                      <p class="font-medium text-[#fafafa] truncate">{{ data.name }}</p>
                      <p class="text-xs text-[#71717a]">
                        {{ i18n.t('lists.by') }} {{ data.created_by.name }}
                      </p>
                    </div>
                  </div>
                </template>
              </Column>

              <Column :header="i18n.t('list.progress')" headerClass="text-center" bodyClass="align-middle">
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <ProgressBar class="flex-1" :value="calculateProgress(data)" :showValue="false" />
                    <span class="text-sm text-[#a1a1aa]">{{ calculateProgress(data) }}%</span>
                  </div>
                </template>
              </Column>

              <Column :header="i18n.t('lists.items')" headerClass="text-center" bodyClass="text-center">
                <template #body="{ data }">
                  <div class="flex items-center justify-center gap-2">
                    <Tag severity="warning" :value="getRemainingCount(data)" />
                    <span class="text-[#52525b]">/</span>
                    <Tag severity="info" :value="data.grocery_list_items_count ?? 0" />
                  </div>
                </template>
              </Column>

              <Column :header="i18n.t('lists.sharedWith')" headerClass="text-center" bodyClass="text-center">
                <template #body="{ data }">
                  <div v-if="data.grocery_list_invites?.length" class="flex items-center justify-center gap-2">
                    <AvatarGroup>
                      <Avatar
                        v-for="invite in data.grocery_list_invites.slice(0, 3)"
                        :key="invite.user?.id"
                        :label="invite.user?.name?.charAt(0)?.toUpperCase() ?? '?'"
                        class="font-semibold"
                        :style="{ backgroundColor: stringToColor(invite?.user?.name), color: '#18181b' }"
                        shape="circle"
                        size="small"
                      />
                    </AvatarGroup>
                    <Tag
                      v-if="data.grocery_list_invites.length > 3"
                      :value="`+${data.grocery_list_invites.length - 3}`"
                      severity="secondary"
                    />
                  </div>
                  <span v-else class="text-xs text-[#52525b]">—</span>
                </template>
              </Column>

              <Column headerClass="text-right w-10" bodyClass="text-right">
                <template #body="{ data }">
                  <Button
                    icon="pi pi-ellipsis-v"
                    text
                    rounded
                    @click.stop="openActionMenu($event, data)"
                  />
                </template>
              </Column>
              </DataTable>
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

.lists-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: #fafafa;
  color: #18181b;
  border: 1px solid transparent;
  transition: background 0.15s ease;
}

.lists-cta:hover {
  background: #d4d4d8;
}

.lists-cta.secondary {
  background: transparent;
  color: #71717a;
  border: 1px solid #27272a;
}

.lists-cta.secondary:hover {
  border-color: #52525b;
  color: #a1a1aa;
}

:deep(.lists-table .p-datatable-wrapper) {
  overflow: hidden;
}

:deep(.lists-table .p-datatable) {
  border-top: 1px solid #27272a;
  background: #1e1e21;
  color: #fafafa;
  box-shadow: none;
}

:deep(.lists-table .p-datatable-header) {
  padding: 0;
  border: 0;
}

:deep(.lists-table .p-datatable-thead > tr > th) {
  background: #1e1e21;
  padding: 0.75rem 1.25rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #52525b;
  font-weight: 500;
  border-bottom: 1px solid #27272a;
}

:deep(.lists-table .p-datatable-tbody > tr > td) {
  padding: 1rem 1.25rem;
  border: 0;
  color: #fafafa;
}

:deep(.lists-table .p-datatable-tbody > tr) {
  border-bottom: 1px solid #27272a;
  transition: background 0.15s ease;
  background: transparent;
}

:deep(.lists-table .p-datatable-tbody > tr:last-child) {
  border-bottom: 0;
}

:deep(.lists-table .p-datatable-tbody > tr.p-highlight) {
  background: #27272a;
}

:deep(.lists-table .p-datatable-tbody > tr:hover) {
  background: #1e1e21;
}

:deep(.lists-table .p-progressbar) {
  height: 0.375rem;
  border-radius: 999px;
  background: #27272a;
}

:deep(.lists-table .p-progressbar-value) {
  border-radius: 999px;
  background: #52525b;
}

:deep(.lists-menu.p-menu) {
  border-radius: 0.75rem;
  border: 1px solid #27272a;
  background: #1e1e21;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  padding: 0.4rem;
}

:deep(.lists-menu .p-menuitem-link) {
  border-radius: 0.5rem;
  padding: 0.55rem 0.75rem;
  gap: 0.6rem;
  color: #a1a1aa;
}

:deep(.lists-menu .p-menuitem-link:hover) {
  background: #27272a;
  color: #fafafa;
}

:deep(.lists-menu .p-menuitem-link .p-menuitem-text) {
  color: inherit;
}

:deep(.lists-menu .p-menuitem-link .p-menuitem-icon) {
  color: inherit;
}
</style>
