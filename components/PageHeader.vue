<script setup lang="ts">
import { useSlots } from 'vue'
import { useI18nStore } from '~/stores/i18n'

defineProps<{
  backTo: string
  title: string
  subtitle?: string
}>()

const i18n = useI18nStore()
const slots = useSlots()
</script>

<template>
  <div class="w-full py-4 border-b border-surface-200">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          :to="backTo"
          :aria-label="i18n.t('common.back')"
          class="w-9 h-9 flex items-center justify-center border border-surface-200 rounded text-color-secondary hover:border-surface-400 hover:text-color transition flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="page-heading truncate">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-color-secondary">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
