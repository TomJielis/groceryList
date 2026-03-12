<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import {useI18nStore} from '~/stores/i18n';
import {useAuthStore} from "~/stores/auth";
import deleteModal from '~/components/deleteModal.vue';
import type { TGroceryListInvite } from '~/types/TGroceryList';
import Button from 'primevue/button';

const listStore = useListStore();
const {showNotification, showSuccess} = useNotification();
const emit = defineEmits(['list-added', 'close']);
const {createList, updateList, unshareList} = useGroceryList();
const i18n = useI18nStore();
const auth = useAuthStore();

const props = defineProps<{ listId?: number }>();

let newList = ref('');

onMounted(() => {
  if (props.listId) {
    const list = listStore.lists.find(l => l.id === props.listId);
    if (list) newList.value = list.name;
  }
});

watch(() => props.listId, (newId) => {
  if (newId) {
    const list = listStore.lists.find(l => l.id === newId);
    if (list) newList.value = list.name;
  } else {
    newList.value = '';
  }
});

async function addList() {
  createList(newList.value.trim())
      .then(() => {
        listStore.fetchLists();
        newList.value = '';
        showSuccess(i18n.t('lists.created'));
        emit('list-added');
      })
      .catch(() => {
        showNotification(i18n.t('errors.listCreateFailed'));
      });
}

async function updateListName() {
  if (!props.listId) return;
  updateList(props.listId, newList.value.trim())
    .then(() => {
      listStore.fetchLists();
      emit('list-added');
      showSuccess(i18n.t('lists.updated'));
    })
    .catch(() => {
      showNotification(i18n.t('errors.listCreateFailed'));
    });
}

const sharedUsersLoading = ref(false);
const sharedInvites = ref<TGroceryListInvite[]>([]);

function loadSharedInvites() {
  if (!props.listId) return;
  sharedUsersLoading.value = true;
  const list = listStore.lists.find(l => l.id === props.listId);
  sharedInvites.value = list?.grocery_list_invites || [];
  sharedUsersLoading.value = false;
}

onMounted(() => {
  loadSharedInvites();
});

watch(() => props.listId, () => {
  loadSharedInvites();
});

const showUnshareModal = ref(false);
const inviteToRemove = ref<TGroceryListInvite | null>(null);

function openUnshareModal(invite: TGroceryListInvite) {
  inviteToRemove.value = invite;
  showUnshareModal.value = true;
}
function closeUnshareModal() {
  showUnshareModal.value = false;
  inviteToRemove.value = null;
}
async function confirmUnshare() {
  if (!props.listId || !inviteToRemove.value) return;
  try {
    await unshareList(props.listId, inviteToRemove.value.user.id);
    await listStore.fetchLists();
    loadSharedInvites();
    showNotification(i18n.t('lists.sharedUserRemoved'), 'success');
  } catch (e) {
    showNotification(i18n.t('errors.listUnshareFailed'));
  } finally {
    closeUnshareModal();
  }
}

async function removeSharedUser(invite: any) {
  if (!props.listId) return;
  if (invite?.user?.id === auth.user.id) return; // prevent removing self
  openUnshareModal(invite);
}
</script>
<template>
  <div class="flex flex-col gap-6" style="font-family: 'DM Sans', system-ui, sans-serif;">
    <!-- Header -->
    <div>
      <h2 class="page-heading">
        {{ props.listId ? i18n.t('lists.editList') : i18n.t('lists.newList') }}
      </h2>
      <p v-if="props.listId" class="text-sm text-surface-500 mt-0.5">
        {{ i18n.t('lists.editDescription') }}
      </p>
    </div>

    <!-- List Name Input -->
    <div>
      <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5 text-surface-400">
        {{ i18n.t('lists.form.name') }}
      </label>
      <input
        v-model="newList"
        type="text"
        :placeholder="i18n.t('lists.form.placeholder')"
        class="w-full px-0 py-2 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition text-base font-medium placeholder:text-surface-300"
        @keyup.enter="props.listId ? updateListName() : addList()"
      />
    </div>

    <!-- Shared Users Section -->
    <div v-if="props.listId && sharedInvites.length > 0">
      <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-3 text-surface-400">
        {{ i18n.t('lists.sharedWith') }} ({{ sharedInvites.length }})
      </p>

      <div v-if="sharedUsersLoading" class="py-4 flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-surface-300 border-t-surface-500"></div>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="invite in sharedInvites"
          :key="invite.id"
          class="flex items-center justify-between py-3 border-t border-surface-200"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold">
              {{ (invite.user?.name || invite.user?.email || '?').charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium">{{ invite.user?.name || invite.user?.email }}</p>
              <p v-if="invite.user?.name" class="text-xs text-surface-500">{{ invite.user?.email }}</p>
            </div>
          </div>
          <Button
            v-if="invite.user?.id !== auth.user.id"
            severity="secondary"
            text
            @click="removeSharedUser(invite)"
            class="w-8 h-8 p-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </Button>
        </div>
        <div class="border-t border-surface-200"></div>
      </div>
    </div>

    <!-- Empty state for shared users -->
    <div v-else-if="props.listId">
      <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-2 text-surface-400">
        {{ i18n.t('lists.sharedWith') }}
      </p>
      <p class="text-sm text-surface-400">{{ i18n.t('lists.noSharedUsers') }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 pt-2">
      <Button
        severity="secondary"
        outlined
        @click="emit('close')"
        class="flex-1"
      >
        {{ i18n.t('common.cancel') }}
      </Button>
      <Button
        severity="primary"
        @click="props.listId ? updateListName() : addList()"
        :disabled="!newList.trim()"
        class="flex-1"
      >
        {{ props.listId ? i18n.t('lists.form.updateBtn') : i18n.t('lists.form.createBtn') }}
      </Button>
    </div>
  </div>

  <!-- Unshare Confirmation Modal -->
  <deleteModal
    :is-visible="showUnshareModal"
    :title="i18n.t('common.delete')"
    :content="i18n.t('lists.delete-shared-user-body')"
    :item-name="inviteToRemove?.user?.name || inviteToRemove?.user?.email || ''"
    :delete-button-text="i18n.t('common.delete')"
    :withValidation="false"
    @close="closeUnshareModal"
    @confirm="confirmUnshare"
  />
</template>
