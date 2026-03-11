<script setup lang="ts">
import type { TGroceryListInvite } from '~/types/TGroceryList';
import { useI18nStore } from '~/stores/i18n';
import { useAuthStore } from '~/stores/auth';

defineProps<{
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
    <div class="flex items-center gap-2 pb-3 border-b border-[#27272a] mb-1">
      <svg class="w-4 h-4 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
        {{ i18n.t('lists.sharedWith') }}
      </p>
      <span v-if="invites.length > 0" class="text-xs border border-[#27272a] text-[#71717a] px-2 py-0.5 rounded font-medium">
        {{ invites.length }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin h-6 w-6 border border-[#3f3f46] border-t-[#a1a1aa] rounded-full"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!invites.length" class="py-6 text-center">
      <svg class="w-10 h-10 mx-auto mb-3 text-[#3f3f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="text-sm text-[#52525b]">
        {{ i18n.t('lists.noSharedUsers') }}
      </p>
    </div>

    <!-- Users List -->
    <div v-else>
      <transition-group name="list" tag="div">
        <div
          v-for="invite in invites"
          :key="invite.id"
          class="flex items-center justify-between border-b border-[#27272a] py-3"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Avatar -->
            <div class="w-8 h-8 bg-[#27272a] rounded flex items-center justify-center text-[#a1a1aa] text-sm font-medium flex-shrink-0">
              {{ initial(invite.user?.name || invite.user?.email) }}
            </div>

            <!-- User Info -->
            <div class="flex flex-col min-w-0 flex-1">
              <span class="text-sm font-medium text-[#fafafa] truncate">
                {{ invite.user?.name || invite.user?.email }}
              </span>
              <span
                v-if="invite.user?.name && invite.user?.email"
                class="text-xs text-[#71717a] truncate"
              >
                {{ invite.user.email }}
              </span>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            v-if="invite.user?.id !== auth.user.id"
            @click.prevent.stop="emit('remove', invite)"
            class="flex-shrink-0 p-1.5 text-[#52525b] hover:text-[#a1a1aa] transition-colors ml-2 rounded"
            :title="i18n.t('common.delete')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>
