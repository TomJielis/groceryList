<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  confirmText: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'update:confirmText', value: string): void;
}>();

const i18n = useI18nStore();

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}

function updateConfirmText(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:confirmText', target.value);
}

const visible = computed({
  get: () => props.isVisible,
  set: (val) => { if (!val) handleClose(); },
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="i18n.t('profile.deactivateAccountTitle')"
    modal
    :style="{ width: '400px', maxWidth: '90vw' }"
    @hide="handleClose"
  >
    <div class="space-y-4">
      <!-- Warning Message -->
      <div style="padding: 1rem; border: 1px solid var(--app-error); background: color-mix(in srgb, var(--app-error) 15%, transparent); border-radius: 4px;">
        <p style="font-weight: 600; color: var(--app-error); margin-bottom: 4px;">
          {{ i18n.t('profile.permanentAction') }}
        </p>
        <p style="font-size: 14px; color: color-mix(in srgb, var(--app-error) 80%, transparent);">
          {{ i18n.t('profile.deactivateAccountWarning') }}
        </p>
      </div>

      <!-- Confirmation Instructions -->
      <p style="font-size: 14px; color: var(--p-surface-500);">
        {{ i18n.t('profile.deactivateAccountConfirm') }}
      </p>
      <p style="font-size: 15px; font-weight: 600; color: var(--app-error);">DELETE</p>

      <!-- Confirmation Input -->
      <InputText
        :value="confirmText"
        @input="updateConfirmText"
        type="text"
        placeholder="DELETE"
        class="w-full"
        @keyup.enter="confirmText === 'DELETE' && handleConfirm()"
      />
    </div>

    <template #footer>
      <Button :label="i18n.t('common.cancel')" severity="secondary" @click="handleClose" />
      <Button
        :label="i18n.t('profile.deactivateAccount')"
        severity="danger"
        :disabled="confirmText !== 'DELETE'"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>
