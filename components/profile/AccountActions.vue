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
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold mb-4">{{ i18n.t('profile.accountActions') }}</h2>

    <button
      @click="handleLogout"
      class="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mb-3"
    >
      🚪 {{ i18n.t('nav.logout') }}
    </button>

    <button
      @click="handleDeactivateAccount"
      class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
    >
      ⚠️ {{ i18n.t('profile.deactivateAccount') }}
    </button>
  </div>
</template>
