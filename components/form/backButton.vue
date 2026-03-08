<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '~/stores/i18n'

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
      <button
        :type="props.type || 'button'"
        :aria-label="ariaLabel || labelText"
        class="py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-base transition-all active:scale-95 w-full"
        @click="onClick"
      >
        <slot>{{ labelText }}</slot>
      </button>
    </div>
  </div>
</template>