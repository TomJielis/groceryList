<script setup lang="ts">
import {ref, defineEmits, watch, onMounted} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import {useI18nStore} from '~/stores/i18n';
import formInput from "~/components/form/formInput.vue"
import backButton from "~/components/form/backButton.vue"

definePageMeta({
  middleware: ['auth', 'terms'],
});


const listStore = useListStore();
const {showNotification} = useNotification();
const emit = defineEmits(['list-added', 'close']);
const {createList, updateList} = useGroceryList();
const i18n = useI18nStore();

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
      .then((data) => {
        listStore.fetchLists();
        newList.value = '';
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
    })
    .catch(() => {
      showNotification(i18n.t('errors.listCreateFailed'));
    });
}
</script>
<template>
  <div class="mt-6 max-w-md mx-auto px-4">
    <formInput
        v-model="newList"
        :label="i18n.t('lists.form.name')"
        :placeholder="i18n.t('lists.form.placeholder')"
        inputType="text"
    />
    <button
        class="w-full py-3 rounded-xl bg-blue-500 font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition"
        @click="props.listId ? updateListName() : addList()"
    >
      ➕ {{ props.listId ? i18n.t('lists.form.updateBtn') : i18n.t('lists.form.createBtn') }}
    </button>
  </div>
  <backButton
    :label="i18n.t('common.back')"
    @click="emit('close')"
    @close="emit('close')"
  />
</template>
