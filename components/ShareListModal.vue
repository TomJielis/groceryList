<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed, watch, onUnmounted } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  email: string;
  listName?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', email: string): void;
  (e: 'update:email', value: string): void;
}>();

const i18n = useI18nStore();

// Prevent body scroll when modal is open
watch(() => props.isVisible, (isVisible) => {
  if (import.meta.client) {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm', props.email);
}

function updateEmail(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:email', target.value);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const visible = computed({
  get: () => props.isVisible,
  set: (val) => { if (!val) handleClose(); },
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="i18n.t('lists.shareTitle')"
    modal
    :style="{ width: '400px', maxWidth: '90vw' }"
    @hide="handleClose"
  >
    <p v-if="listName" style="color: var(--p-surface-500); font-size: 13px; margin-bottom: 12px;">{{ listName }}</p>

    <p style="color: var(--p-surface-600); font-size: 14px; margin-bottom: 16px;">
      {{ i18n.t('lists.sharePrompt') }}
    </p>

    <div>
      <label style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--p-surface-400); font-weight: 600; display: block; margin-bottom: 8px;">
        {{ i18n.t('lists.emailAddress') }}
      </label>
      <InputText
        :value="email"
        @input="updateEmail"
        type="email"
        :placeholder="i18n.t('lists.shareEmailPlaceholder')"
        class="w-full"
        @keyup.enter="isValidEmail(email) && handleConfirm()"
      />
      <p v-if="email && !isValidEmail(email)" style="margin-top: 8px; font-size: 12px; color: var(--app-error); display: flex; align-items: center; gap: 4px;">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ i18n.t('validation.invalidEmail') }}</span>
      </p>
    </div>

    <template #footer>
      <Button :label="i18n.t('common.cancel')" severity="secondary" @click="handleClose" />
      <Button
        :label="i18n.t('lists.shareBtn')"
        severity="primary"
        :disabled="!isValidEmail(email)"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>
