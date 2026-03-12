<script setup lang="ts">
import {useI18nStore} from '~/stores/i18n';
import { computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  itemName?: string;
  itemType: 'list' | 'card';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const i18n = useI18nStore();

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}

const visible = computed({
  get: () => props.isVisible,
  set: (val) => { if (!val) handleClose(); },
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="itemType === 'list' ? i18n.t('lists.deleteTitle') : i18n.t('cards.deleteTitle')"
    modal
    :style="{ width: '400px', maxWidth: '90vw' }"
    @hide="handleClose"
  >
    <p v-if="itemName" style="color: var(--p-surface-500); font-size: 13px; margin-bottom: 4px;">{{ itemName }}</p>
    <p style="color: var(--p-surface-600); font-size: 14px;">
      {{ itemType === 'list' ? i18n.t('lists.confirmDelete') : i18n.t('cards.confirmDelete') }}
    </p>

    <template #footer>
      <Button :label="i18n.t('common.cancel')" severity="secondary" @click="handleClose" />
      <Button
        :label="itemType === 'list' ? i18n.t('lists.deleteBtn') : i18n.t('cards.deleteBtn')"
        severity="danger"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>
