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
      class="w-full py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 shadow-sm"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span>{{ i18n.t('nav.logout') || 'Uitloggen' }}</span>
    </button>

    <!-- Danger Zone -->
    <div class="mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="text-sm font-bold text-red-600 dark:text-red-400">{{ i18n.t('profile.dangerZone') || 'Gevarenzone' }}</h3>
      </div>

      <button
        @click="handleDeactivateAccount"
        class="w-full py-3.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>{{ i18n.t('profile.deactivateAccount') || 'Account deactiveren' }}</span>
      </button>

      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
        {{ i18n.t('profile.deactivateWarning') || 'Deze actie is permanent en kan niet ongedaan worden gemaakt' }}
      </p>
    </div>
  </div>
</template>
