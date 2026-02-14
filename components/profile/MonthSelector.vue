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
  <div class="flex items-center justify-center gap-4">
    <button
      type="button"
      :disabled="!canGoOlder"
      class="p-2 rounded-lg transition-colors"
      :class="canGoOlder
        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
      @click="goOlder"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <span class="text-lg font-medium text-slate-900 dark:text-white min-w-[160px] text-center capitalize">
      {{ formatMonth(selectedMonth) }}
    </span>

    <button
      type="button"
      :disabled="!canGoNewer"
      class="p-2 rounded-lg transition-colors"
      :class="canGoNewer
        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
      @click="goNewer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>
