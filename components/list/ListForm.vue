<script setup lang="ts">
import {ref, defineEmits, watch, onMounted} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import {useI18nStore} from '~/stores/i18n';
import {useAuthStore} from "~/stores/auth";
import formInput from "~/components/form/formInput.vue"
import backButton from "~/components/form/backButton.vue"
import deleteModal from '~/components/deleteModal.vue';
import SharedUsersList from '~/components/list/SharedUsersList.vue';
import type { TGroceryListInvite } from '~/types/TGroceryList';

definePageMeta({
  middleware: ['auth', 'terms'],
});


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
  <div class="mt-6 max-w-md mx-auto px-4">
    <formInput
        v-model="newList"
        :label="i18n.t('lists.form.name')"
        :placeholder="i18n.t('lists.form.placeholder')"
        inputType="text"
        :disabled="false"
    />
  <backButton
    :label="i18n.t('common.back')"
    @click="emit('close')"
    @close="emit('close')"
  />
  <SharedUsersList
    v-if="props.listId"
    class="mt-6"
    :invites="sharedInvites"
    :loading="sharedUsersLoading"
    @remove="removeSharedUser"
  />
    <button
        class="w-full py-3 rounded-xl bg-blue-500 font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition mt-6"
        @click="props.listId ? updateListName() : addList()"
    >
      ➕ {{ props.listId ? i18n.t('lists.form.updateBtn') : i18n.t('lists.form.createBtn') }}
    </button>
  </div>
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
