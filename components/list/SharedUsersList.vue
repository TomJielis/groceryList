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
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <div class="flex items-center justify-between mb-1">
        <h2 class="text-base font-bold text-primary-dark dark:text-accent-light flex items-center gap-2">👥 {{ i18n.t('lists.sharedUsersTitle') }}</h2>
        <span v-if="invites.length" class="text-xs px-2 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent font-semibold">{{ invites.length }}</span>
      </div>
      <div v-if="loading" class="text-center text-gray-500 py-3 text-sm">Loading...</div>
      <div v-else-if="!invites.length" class="text-center text-gray-500 py-3 text-sm">
        {{ i18n.t('lists.sharedUsersNone') }}
      </div>
      <ul v-else class="flex flex-col gap-3">
        <li
          v-for="invite in invites"
          :key="invite.id"
          class="border border-border-light bg-white/95 dark:bg-slate-900/95 rounded-xl transition hover:shadow-lg hover:border-accent/60 flex items-center animate-fade-in px-3 py-3 gap-3"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-9 h-9 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
              {{ initial(invite.user?.name) }}
            </div>
            <div class="flex flex-col truncate">
              <span class="font-semibold text-slate-700 dark:text-slate-100 truncate text-sm">{{ invite.user?.name || invite.user?.email }}</span>
              <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate" v-if="invite.user?.email && invite.user?.email !== invite.user?.name">{{ invite.user.email }}</span>
            </div>
          </div>
          <button
            v-if="invite.user?.id !== auth.user.id"
            class="px-3 py-2 rounded-lg bg-error text-white text-[11px] font-semibold hover:bg-error/90 active:scale-[0.97] transition shadow"
            @click.prevent.stop="emit('remove', invite)"
          >
            {{ i18n.t('common.delete') }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
@keyframes fade-in {
  from { opacity:0; transform: translateY(6px); }
  to { opacity:1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.35s ease; }
</style>
