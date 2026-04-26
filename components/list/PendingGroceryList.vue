<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useListStore } from '~/stores/lists';
import { useI18nStore } from "~/stores/i18n";
import { useNotification } from '~/composables/useNotification';
import type { TGroceryList } from '@/types/TGroceryList';
import { useGroceryList } from "~/composables/useGroceryList";
import Button from 'primevue/button';

const emit = defineEmits(['refresh']);

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
    return (list.created_by as { name: string }).name;
  }
  return 'Unknown';
}
</script>

<template>
  <div v-if="pendingLists && pendingLists.length > 0" class="space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-200">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 flex items-center justify-center rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-surface-500">
            {{ i18n.t('lists.approveOrDecline') }}
          </p>
        </div>
      </div>
      <span class="px-2 py-0.5 border border-surface-200 text-xs font-medium rounded">
        {{ pendingLists.length }}
      </span>
    </div>

    <!-- Pending Lists -->
    <div class="pending-scroll">
      <transition-group name="list" tag="div">
        <div
          v-for="list in pendingLists"
          :key="list.id"
          class="list-item-row border-b border-surface-100 py-4 mb-1"
        >
          <!-- List Info -->
          <div class="flex items-start gap-3 mb-4">
            <div class="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium truncate">
                {{ list.name }}
              </h4>
              <p class="text-xs text-surface-500 mt-0.5">
                {{ i18n.t('lists.invitedBy') }} <span class="font-medium">{{ getCreatorName(list) }}</span>
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <Button
              :label="i18n.t('lists.approve')"
              severity="primary"
              class="flex-1"
              @click="handleAction(list.id, 'accepted')"
            />
            <Button
              :label="i18n.t('lists.decline')"
              severity="secondary"
              outlined
              class="flex-shrink-0"
              @click="handleAction(list.id, 'declined')"
            />
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.pending-scroll {
  max-height: 22rem;
  overflow-y: auto;
  padding-right: 0.35rem;
}

.pending-scroll::-webkit-scrollbar {
  width: 4px;
}

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
