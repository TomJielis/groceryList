<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useListStore } from '~/stores/lists';
import { useI18nStore } from "~/stores/i18n";
import { useNotification } from '~/composables/useNotification';
import type { TGroceryList } from '@/types/TGroceryList';
import { useGroceryList } from "~/composables/useGroceryList";

definePageMeta({
  middleware: ['auth', 'terms'],
});


const i18n = useI18nStore();
const listStore = useListStore();
const notification = useNotification();
const { updatePendingListStatus } = useGroceryList();

onMounted(() => {
  listStore.fetchPendingLists();
});

const pendingLists = computed(() => listStore.pendingLists);

async function handleAction(id: number, status: 'accepted' | 'declined') {
  await updatePendingListStatus(id, status);
  listStore.removePendingList(id);
  if (status === 'accepted') {
    notification.showSuccess(i18n.t('lists.approvedMessage'));
  } else {
    notification.showSuccess(i18n.t('lists.declinedMessage'));
  }
}

function getCreatorName(list: TGroceryList): string {
  if (list.created_by && typeof list.created_by === 'object' && 'name' in list.created_by) {
    // @ts-ignore
    return list.created_by.name;
  }
  return 'Unknown';
}
</script>

<template>
  <div v-if="pendingLists && pendingLists.length > 0" class="mb-6">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {{ i18n.t('lists.pendingInvites') || 'Uitnodigingen in afwachting' }}
      </h3>
      <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
        {{ pendingLists.length }}
      </span>
    </div>

    <!-- Pending Lists -->
    <div class="space-y-3">
      <transition-group name="list" tag="div" class="space-y-3">
        <div
          v-for="list in pendingLists"
          :key="list.id"
          class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-sm"
        >
          <!-- List Info -->
          <div class="mb-4">
            <div class="flex items-start gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-bold text-slate-900 dark:text-white truncate">
                  {{ list.name }}
                </h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {{ i18n.t('lists.invitedBy') || 'Uitgenodigd door' }} <span class="font-semibold">{{ getCreatorName(list) }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="handleAction(list.id, 'accepted')"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ i18n.t('lists.approve') || 'Accepteren' }}</span>
            </button>
            <button
              @click="handleAction(list.id, 'declined')"
              class="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>{{ i18n.t('lists.decline') || 'Weigeren' }}</span>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
