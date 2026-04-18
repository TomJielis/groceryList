<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '~/stores/i18n'
import Button from 'primevue/button'

const props = defineProps<{
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}>()

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
  (e: 'close'): void
}>()

const i18n = useI18nStore()
const labelText = computed(() => props.label || i18n.t('common.back'))

function onClick(e: MouseEvent) {
  emit('click', e)
  emit('close')
}
</script>

<template>
  <div class="fixed left-0 mt-6 space-y-3 p-4 bottom-20 md:bottom-3 z-50 flex justify-center w-full">
    <div class="w-full max-w-md">
      <Button
        :type="props.type || 'button'"
        :aria-label="ariaLabel || labelText"
        severity="secondary"
        outlined
        class="w-full active:scale-95"
        @click="onClick"
      >
        <slot>{{ labelText }}</slot>
      </Button>
    </div>
  </div>
</template>
