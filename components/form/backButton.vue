<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useI18nStore } from '~/stores/i18n'

const props = defineProps({
  label: { type: String as PropType<string>, default: '' },
  type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  ariaLabel: { type: String as PropType<string>, default: '' },
})

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
        :type="props.type"
        :aria-label="ariaLabel || labelText"
        class="py-3 px-6 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition w-full"
        @click="onClick"
      >
        <slot>{{ labelText }}</slot>
      </button>
    </div>
  </div>
</template>