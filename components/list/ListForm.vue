<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {useGroceryList} from "~/composables/useGroceryList";
import {useNotification} from "~/composables/useNotification";
import {useListStore} from "~/stores/lists";
import { useI18nStore } from '~/stores/i18n';

const listStore = useListStore();
const {showNotification} = useNotification();
const emit = defineEmits(['list-added', 'close']);
const { createList } = useGroceryList();
const i18n = useI18nStore();

let newList = ref('');

async function addList() {
  createList(newList.value.trim())
      .then((data) => {
        listStore.addList(data.data);
        newList.value = '';
        emit('list-added');
      })
      .catch(() => {
        showNotification(i18n.t('errors.listCreateFailed'));
      });
}
</script>
<template>
  <div class="mt-8 max-w-md mx-auto px-4">
    <input
        type="text"
        v-model="newList"
        :placeholder="i18n.t('lists.form.placeholder')"
        class="w-full mb-4 px-5 py-3 rounded-2xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 shadow-xl focus:ring-2 focus:ring-accent focus:border-accent text-base md:text-lg transition-colors placeholder-slate-400 dark:placeholder-slate-500"
    />
    <button
        class="w-full py-3 rounded-2xl bg-accent text-white font-semibold text-base md:text-lg shadow-xl hover:bg-accent-dark active:scale-[0.98] transition border border-accent/80 focus:ring-2 focus:ring-accent"
        @click="addList"
    >
      ➕ {{ i18n.t('lists.form.createBtn') }}
    </button>
  </div>
  <div class="fixed left-0 w-full mt-6 space-y-3 p-4 bottom-20 md:bottom-3 z-50">
    <button
        class="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium text-base hover:bg-accent/10 dark:hover:bg-accent/20 transition shadow-md border border-border-light dark:border-border-dark"
        @click="$emit('close')"
    >
      ← {{ i18n.t('common.back') }}
    </button>
  </div>
</template>
