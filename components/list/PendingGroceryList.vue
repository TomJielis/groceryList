<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useListStore } from '~/stores/lists';
import { useI18nStore } from "~/stores/i18n";
import { useNotification } from '~/composables/useNotification';
import type { TGroceryList } from '@/types/TGroceryList';
import { useGroceryList } from "~/composables/useGroceryList";

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
    // @ts-ignore
    return list.created_by.name;
  }
  return 'Unknown';
}
</script>

<template>
  <div v-if="pendingLists && pendingLists.length > 0" class="pending-shell space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 text-white">
        <div class="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-200/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold tracking-[0.2em] uppercase text-slate-200">
            {{ i18n.t('lists.pendingInvites') }}
          </h3>
          <p class="text-xs text-slate-400">
            {{ i18n.t('lists.approveOrDecline') }}
          </p>
        </div>
      </div>
      <span class="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
        {{ pendingLists.length }}×
      </span>
    </div>

    <!-- Pending Lists -->
    <div class="pending-scroll space-y-3">
      <transition-group name="list" tag="div" class="space-y-3">
        <div
          v-for="list in pendingLists"
          :key="list.id"
          class="pending-card rounded-2xl border border-white/10 bg-white/5 p-4 text-white/90"
        >
          <!-- List Info -->
          <div class="mb-4">
            <div class="flex items-start gap-3 mb-2">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-200/30 to-amber-400/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-semibold text-white truncate">
                  {{ list.name }}
                </h4>
                <p class="text-sm text-slate-300 mt-0.5">
                  {{ i18n.t('lists.invitedBy') }} <span class="font-semibold text-white">{{ getCreatorName(list) }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 flex-col sm:flex-row">
            <button
              @click="handleAction(list.id, 'accepted')"
              class="flex-1 pending-btn primary"
            >
              {{ i18n.t('lists.approve') }}
            </button>
            <button
              @click="handleAction(list.id, 'declined')"
              class="flex-1 pending-btn secondary"
            >
              {{ i18n.t('lists.decline') }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
/* Scroll container */
.pending-shell {
  color: #fff;
}

.pending-scroll {
  max-height: 22rem;
  overflow-y: auto;
  padding-right: 0.35rem;
}

.pending-scroll::-webkit-scrollbar {
  width: 6px;
}

.pending-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
}

.pending-scroll::-webkit-scrollbar-thumb {
  background: rgba(248, 250, 252, 0.25);
  border-radius: 999px;
}

.pending-btn {
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.pending-btn.primary {
  background: linear-gradient(120deg, #34d399, #10b981);
  color: #0f172a;
}

.pending-btn.secondary {
  border: 1px solid rgba(248, 250, 252, 0.3);
  background: rgba(15, 23, 42, 0.6);
  color: #f8fafc;
}

.pending-btn:active {
  transform: scale(0.97);
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
