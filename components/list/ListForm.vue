<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import {useI18nStore} from '~/stores/i18n';
import {useAuthStore} from "~/stores/auth";
import deleteModal from '~/components/deleteModal.vue';
import type { TGroceryListInvite } from '~/types/TGroceryList';

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
  <div class="flex flex-col h-full max-h-[80vh]">
    <!-- Header -->
    <div class="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h2 class="text-xl font-bold text-white">
            {{ props.listId ? (i18n.t('lists.editList') || 'Lijst bewerken') : (i18n.t('lists.newList') || 'Nieuwe lijst maken') }}
          </h2>
        </div>
        <button
          @click="emit('close')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors active:scale-95"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 py-6 bg-slate-50 dark:bg-slate-900">
      <!-- List Name Input -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {{ i18n.t('lists.form.name') || 'Lijst naam' }}
        </label>
        <input
          v-model="newList"
          type="text"
          :placeholder="i18n.t('lists.form.placeholder') || 'Bv. Boodschappen, Weekend BBQ...'"
          class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
          @keyup.enter="props.listId ? updateListName() : addList()"
        />
      </div>

      <!-- Shared Users Section -->
      <div v-if="props.listId && sharedInvites.length > 0" class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {{ i18n.t('lists.sharedWith') || 'Gedeeld met' }} ({{ sharedInvites.length }})
          </h3>
        </div>

        <div v-if="sharedUsersLoading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="invite in sharedInvites"
            :key="invite.id"
            class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                {{ (invite.user?.name || invite.user?.email || '?').charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-medium text-slate-900 dark:text-white">{{ invite.user?.name || invite.user?.email }}</p>
                <p v-if="invite.user?.name" class="text-xs text-slate-500 dark:text-slate-400">{{ invite.user?.email }}</p>
              </div>
            </div>
            <button
              v-if="invite.user?.id !== auth.user.id"
              @click="removeSharedUser(invite)"
              class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state for shared users -->
      <div v-else-if="props.listId" class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {{ i18n.t('lists.sharedWith') || 'Gedeeld met' }}
          </h3>
        </div>
        <div class="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ i18n.t('lists.noSharedUsers') || 'Deze lijst is nog niet gedeeld met anderen' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer with Action Buttons -->
    <div class="flex-shrink-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 shadow-lg rounded-b-2xl">
      <div class="flex gap-3">
        <button
          @click="emit('close')"
          class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-98 flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span>{{ i18n.t('common.cancel') || 'Annuleren' }}</span>
        </button>
        <button
          @click="props.listId ? updateListName() : addList()"
          :disabled="!newList.trim()"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ props.listId ? i18n.t('lists.form.updateBtn') || 'Opslaan' : i18n.t('lists.form.createBtn') || 'Aanmaken' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Unshare Confirmation Modal -->
  <deleteModal
    :is-visible="showUnshareModal"
    :title="i18n.t('common.delete') || 'Verwijderen'"
    :content="i18n.t('lists.delete-shared-user-body') || 'Weet je zeker dat je deze gebruiker wilt verwijderen?'"
    :item-name="inviteToRemove?.user?.name || inviteToRemove?.user?.email || ''"
    :delete-button-text="i18n.t('common.delete') || 'Verwijderen'"
    :withValidation="false"
    @close="closeUnshareModal"
    @confirm="confirmUnshare"
  />
</template>
