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
    <h2 class="text-lg font-bold text-primary-dark dark:text-accent-light mb-4">{{ i18n.t('profile.accountActions') }}</h2>
    <button
      @click="handleLogout"
      class="w-full py-3 rounded-xl bg-accent text-white font-semibold shadow hover:bg-accent-dark transition border border-accent/80 focus:ring-2 focus:ring-accent mb-3"
    >
      🚪 {{ i18n.t('nav.logout') }}
    </button>
    <button
      @click="handleDeactivateAccount"
      class="w-full py-3 rounded-xl bg-error text-white font-semibold shadow hover:bg-error/90 transition border border-error/80 focus:ring-2 focus:ring-error"
    >
      ⚠️ {{ i18n.t('profile.deactivateAccount') }}
    </button>
</template>
