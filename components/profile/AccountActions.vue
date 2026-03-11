<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';

const emit = defineEmits<{
  (e: 'logout'): void;
  (e: 'deactivateAccount'): void;
}>();

const i18n = useI18nStore();

function handleLogout() {
  emit('logout');
}

function handleDeactivateAccount() {
  emit('deactivateAccount');
}
</script>

<template>
  <div class="space-y-3">
    <!-- Logout Button -->
    <button
      @click="handleLogout"
      class="w-full py-2.5 border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] font-medium rounded transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span>{{ i18n.t('nav.logout') }}</span>
    </button>

    <!-- Danger Zone -->
    <div class="pt-5 border-t border-[#27272a]">
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-3">{{ i18n.t('profile.dangerZone') }}</p>

      <button
        @click="handleDeactivateAccount"
        class="w-full py-2.5 border border-red-800 text-red-400 bg-red-900/40 hover:bg-red-900/60 font-medium rounded transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span>{{ i18n.t('profile.deactivateAccount') }}</span>
      </button>

      <p class="mt-2 text-xs text-[#52525b] text-center">
        {{ i18n.t('profile.deactivateWarning') }}
      </p>
    </div>
  </div>
</template>
