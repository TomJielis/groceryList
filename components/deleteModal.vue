<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { ref, computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  title: string;
  content: string;
  itemName?: string;
  deleteButtonText?: string;
  withValidation?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const i18n = useI18nStore();

const confirmText = ref('');
const isDeleteEnabled = computed(() => {
  if (!props.withValidation) return true;
  return confirmText.value.trim() === props.itemName;
});

function handleClose() {
  confirmText.value = '';
  emit('close');
}

function handleConfirm() {
  confirmText.value = '';
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
    :header="title"
    modal
    :style="{ width: '400px', maxWidth: '90vw' }"
    @hide="handleClose"
  >
    <p style="color: var(--p-surface-600); font-size: 14px;">{{ content }}</p>

    <div v-if="withValidation" class="mt-4">
      <p style="color: var(--p-surface-600); font-size: 14px; margin-bottom: 8px;">
        {{ i18n.t('deleteModal.typeListNameToDelete') }}
      </p>
      <p style="color: var(--app-error); font-size: 15px; font-weight: 600; margin-bottom: 12px;">
        {{ itemName }}
      </p>
      <InputText
        v-model="confirmText"
        :placeholder="itemName"
        class="w-full"
      />
    </div>

    <template #footer>
      <Button :label="i18n.t('common.cancel')" severity="secondary" @click="handleClose" />
      <Button
        :label="deleteButtonText || i18n.t('common.delete')"
        severity="danger"
        :disabled="!isDeleteEnabled"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>
