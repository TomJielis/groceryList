<script setup lang="ts">
import type { TGroceryListInvite } from '~/types/TGroceryList';
import { useI18nStore } from '~/stores/i18n';
import { useAuthStore } from '~/stores/auth';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  invites: TGroceryListInvite[];
  loading: boolean;
}>();

const emit = defineEmits<{ (e: 'remove', invite: TGroceryListInvite): void }>();

const i18n = useI18nStore();
const auth = useAuthStore();

function initial(name?: string) {
  return name ? name.charAt(0).toUpperCase() : '?';
}
</script>
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {{ i18n.t('lists.sharedWith') || 'Gedeeld met' }}
      </h3>
      <span v-if="invites.length > 0" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
        {{ invites.length }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!invites.length" class="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ i18n.t('lists.noSharedUsers') || 'Deze lijst is nog niet gedeeld met anderen' }}
      </p>
    </div>

    <!-- Users List -->
    <div v-else class="space-y-2">
      <transition-group name="list" tag="div" class="space-y-2">
        <div
          v-for="invite in invites"
          :key="invite.id"
          class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">
              {{ initial(invite.user?.name || invite.user?.email) }}
            </div>

            <!-- User Info -->
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-medium text-slate-900 dark:text-white truncate">
                {{ invite.user?.name || invite.user?.email }}
              </span>
              <span
                v-if="invite.user?.name && invite.user?.email"
                class="text-xs text-slate-500 dark:text-slate-400 truncate"
              >
                {{ invite.user.email }}
              </span>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            v-if="invite.user?.id !== auth.user.id"
            @click.prevent.stop="emit('remove', invite)"
            class="flex-shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400 ml-2"
            :title="i18n.t('common.delete') || 'Verwijderen'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
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
