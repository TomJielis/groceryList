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
import Card from 'primevue/card'
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
      <div class="lists-hero space-y-5">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div class="space-y-2 text-left max-w-2xl">
            <p class="text-xs uppercase tracking-[0.4em] text-slate-300">
              {{ i18n.t('lists.sharedWith') }}
            </p>
            <h1 class="text-3xl md:text-4xl font-bold text-white">
              {{ i18n.t('lists.title') }}
            </h1>
            <p class="text-sm text-slate-300 max-w-xl">
              {{ i18n.t('lists.emptyState.message') }}
            </p>
          </div>
          <div class="flex gap-3 flex-col sm:flex-row w-full md:w-auto md:justify-end md:flex-shrink-0">
            <button
              v-if="openListForm"
              type="button"
              class="lists-cta secondary w-full sm:w-auto"
              @click="closeListForm"
            >
              <span class="flex items-center gap-2 justify-center">
                <i class="pi pi-times text-base"></i>
                {{ i18n.t('common.cancel') }}
              </span>
            </button>
            <button
              v-else
              type="button"
              class="lists-cta w-full sm:w-auto"
              @click="() => { editListId = undefined; openListForm = true }"
            >
              <span class="flex items-center gap-2 justify-center">
                <i class="pi pi-plus text-base"></i>
                {{ i18n.t('lists.newList') }}
              </span>
            </button>
          </div>
        </div>

        <div class="lists-stat-grid grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="lists-stat-card">
            <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('lists.listCount') }}
            </p>
            <p class="text-2xl font-semibold text-white">{{ sortedLists.length }}</p>
            </div>
            <div class="lists-stat-card">
              <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
                {{ i18n.t('lists.remaining') }}
              </p>
              <p class="text-2xl font-semibold text-amber-300">{{ totalItemsRemaining }}</p>
            </div>
            <div class="lists-stat-card">
              <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
                {{ i18n.t('lists.completed') }}
              </p>
              <p class="text-2xl font-semibold text-emerald-300">{{ totalItemsChecked }}</p>
            </div>
            <div class="lists-stat-card">
              <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
                {{ i18n.t('lists.sharedWith') }}
              </p>
              <p class="text-2xl font-semibold text-sky-300">{{ sharedListsCount }}</p>
            </div>
          </div>
      </div>

      <Card v-if="openListForm" class="lists-card border border-slate-200/60 shadow-xl">
        <template #content>
          <ListForm
            :list-id="editListId"
            @list-added="handleList"
            @close="closeListForm"
          />
        </template>
      </Card>

      <Card v-else class="lists-card border border-slate-200/60 shadow-xl">
        <template #content>
          <div v-if="loading" class="space-y-3">
            <Skeleton height="48px" class="rounded-2xl" />
            <Skeleton height="48px" class="rounded-2xl" />
            <Skeleton height="48px" class="rounded-2xl" />
          </div>

          <div v-else-if="sortedLists.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 text-center text-white">
            <div class="text-5xl">🛒</div>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('lists.emptyState.title') }}
            </h2>
            <p class="text-sm text-slate-200 max-w-md">
              {{ i18n.t('lists.emptyState.message') }}
            </p>
            <Button
              icon="pi pi-plus"
              :label="i18n.t('lists.createFirst')"
              @click="() => { editListId = undefined; openListForm = true }"
            />
          </div>

          <div v-else class="space-y-6">
            <div class="md:hidden space-y-3">
              <div
                v-for="listItem in sortedLists"
                :key="listItem.id"
                class="lists-mobile-card text-white"
                @click="router.push(`/list/${listItem.id}`)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/10"
                  >
                    <span>{{ auth?.user?.favorite_list_id === listItem.id ? '⭐' : '📝' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-white truncate">{{ listItem.name }}</p>
                    <p class="text-xs text-slate-200">{{ i18n.t('lists.by') }} {{ listItem.created_by.name }}</p>
                  </div>
                  <Button
                    icon="pi pi-ellipsis-v"
                    text
                    rounded
                    severity="secondary"
                    @click.stop="openActionMenu($event, listItem)"
                  />
                </div>
                <div class="mt-4 space-y-2">
                  <div class="flex justify-between text-xs text-slate-200">
                    <span>{{ getRemainingCount(listItem) }} {{ i18n.t('lists.remaining') }}</span>
                    <span class="font-semibold text-emerald-300">{{ calculateProgress(listItem) }}%</span>
                  </div>
                  <div class="h-2 bg-white/15 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" :style="{ width: `${calculateProgress(listItem)}%` }"></div>
                  </div>
                  <div class="flex items-center justify-between text-xs text-slate-200">
                    <span>{{ listItem.grocery_list_items_checked_count ?? 0 }}/{{ listItem.grocery_list_items_count ?? 0 }} {{ i18n.t('lists.items') }}</span>
                    <div class="flex -space-x-2">
                      <span
                        v-for="invite in listItem.grocery_list_invites?.slice(0, 3) || []"
                        :key="invite.user?.id"
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-white/60 text-[10px] font-semibold"
                        :style="{ backgroundColor: stringToColor(invite?.user?.name), color: '#0f172a' }"
                      >
                        {{ invite.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              :value="sortedLists"
              dataKey="id"
              responsiveLayout="stack"
              breakpoint="960px"
              rowHover
              @row-click="handleRowNavigate"
              class="lists-table hidden md:block"
            >
              <template #empty>
                <div class="py-8 text-center text-sm text-slate-200">
                  {{ i18n.t('lists.emptyState.message') }}
                </div>
              </template>

              <Column :header="i18n.t('lists.name')">
                <template #body="{ data }">
                  <div class="flex items-center gap-3 min-w-0">
                    <Avatar
                      :icon="auth?.user?.favorite_list_id === data.id ? 'pi pi-star-fill' : 'pi pi-list'"
                      :class="auth?.user?.favorite_list_id === data.id ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-600'"
                      shape="circle"
                    />
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">{{ data.name }}</p>
                      <p class="text-xs text-slate-300">
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
                    <span class="text-sm font-medium">{{ calculateProgress(data) }}%</span>
                  </div>
                </template>
              </Column>

              <Column :header="i18n.t('lists.items')" headerClass="text-center" bodyClass="text-center">
                <template #body="{ data }">
                  <div class="flex items-center justify-center gap-2">
                    <Tag severity="warning" :value="getRemainingCount(data)" />
                    <span>/</span>
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
                        :style="{ backgroundColor: stringToColor(invite?.user?.name), color: '#0f172a' }"
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
                  <span v-else class="text-xs text-slate-300">—</span>
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
        </template>
      </Card>
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
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: transparent;
}

.lists-hero {
  padding: 2rem;
  border-radius: 1.75rem;
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

:deep(.lists-card .p-card-body) {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.85));
  border-radius: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

:deep(.lists-card .p-card-content) {
  padding: 0;
}

.lists-stat-card {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 0.85rem 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.lists-mobile-card {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 1.25rem;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 15px 40px rgba(2, 6, 23, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lists-mobile-card:active {
  transform: scale(0.99);
  box-shadow: 0 12px 24px rgba(2, 6, 23, 0.35);
}

.lists-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  background: linear-gradient(120deg, #fbbf24, #f97316);
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.lists-cta.secondary {
  background: transparent;
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: none;
}

.lists-cta:active {
  transform: translateY(2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.25);
}

.lists-meta {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 0.75rem;
}

:deep(.lists-table .p-datatable-wrapper) {
  border-radius: 1.75rem;
  overflow: hidden;
}

:deep(.lists-table .p-datatable) {
  border-radius: 1.75rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.82);
  color: #f8fafc;
  backdrop-filter: blur(30px);
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
}

:deep(.lists-table .p-datatable-header) {
  padding: 0;
  border: 0;
}

:deep(.lists-table .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.04);
  padding: 0.85rem 1.25rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #cbd5f5;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

:deep(.lists-table .p-datatable-tbody > tr > td) {
  padding: 1rem 1.25rem;
  border: 0;
  color: #f8fafc;
}

:deep(.lists-table .p-datatable-tbody > tr) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  transition: background 0.2s ease, transform 0.2s ease;
  background: transparent;
}

:deep(.lists-table .p-datatable-tbody > tr:last-child) {
  border-bottom: 0;
}

:deep(.lists-table .p-datatable-tbody > tr.p-highlight) {
  background: rgba(59, 130, 246, 0.15);
}

:deep(.lists-table .p-datatable-tbody > tr:hover) {
  background: rgba(59, 130, 246, 0.1);
}

:deep(.lists-table .p-progressbar) {
  height: 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

:deep(.lists-table .p-progressbar-value) {
  border-radius: 999px;
  background: linear-gradient(90deg, #34d399, #10b981);
}

:deep(.lists-menu.p-menu) {
  border-radius: 1rem;
  border: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
  padding: 0.5rem;
}

:deep(.lists-menu .p-menuitem-link) {
  border-radius: 0.75rem;
  padding: 0.6rem 0.85rem;
  gap: 0.65rem;
}

:deep(.lists-menu .p-menuitem-link:hover) {
  background: rgba(59, 130, 246, 0.08);
}

@media (max-width: 768px) {
  :deep(.lists-hero-card .p-card-body) {
    padding: 1.5rem;
  }
}
</style>
