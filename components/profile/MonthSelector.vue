<script setup lang="ts">
import { computed } from 'vue'
import { useI18nStore } from '~/stores/i18n'

const props = defineProps<{
  selectedMonth: string
  availableMonths: string[]
}>()

const emit = defineEmits<{
  (e: 'change', month: string): void
}>()

const i18n = useI18nStore()

const currentIndex = computed(() => {
  return props.availableMonths.indexOf(props.selectedMonth)
})

const canGoOlder = computed(() => {
  return currentIndex.value >= 0 && currentIndex.value < props.availableMonths.length - 1
})

const canGoNewer = computed(() => {
  return currentIndex.value > 0
})

function formatMonth(monthString: string): string {
  const [year, month] = monthString.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const locale = i18n.locale === 'nl' ? 'nl-NL' : 'en-US'
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

function goOlder() {
  if (canGoOlder.value) {
    emit('change', props.availableMonths[currentIndex.value + 1])
  }
}

function goNewer() {
  if (canGoNewer.value) {
    emit('change', props.availableMonths[currentIndex.value - 1])
  }
}
</script>

<template>
  <div class="w-full flex items-center border border-[#27272a] rounded overflow-hidden">
    <button
      type="button"
      :disabled="!canGoOlder"
      class="px-4 py-3 border-r border-[#27272a] transition focus:outline-none flex-shrink-0"
      :class="canGoOlder
        ? 'text-[#a1a1aa] hover:bg-[#1e1e21] hover:text-[#fafafa]'
        : 'text-[#3f3f46] cursor-not-allowed'"
      @click="goOlder"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <span class="flex-1 text-sm font-medium text-[#fafafa] text-center capitalize px-3 py-3">
      {{ formatMonth(selectedMonth) }}
    </span>

    <button
      type="button"
      :disabled="!canGoNewer"
      class="px-4 py-3 border-l border-[#27272a] transition focus:outline-none flex-shrink-0"
      :class="canGoNewer
        ? 'text-[#a1a1aa] hover:bg-[#1e1e21] hover:text-[#fafafa]'
        : 'text-[#3f3f46] cursor-not-allowed'"
      @click="goNewer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>
