<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface Column {
  key: string
  label: string
  type?: 'text' | 'date' | 'datetime' | 'link' | 'number'
  linkTo?: (row: any) => string
  format?: (value: any, row: any) => string
  class?: string
}

interface Props {
  columns: Column[]
  data: any[]
  title?: string
  icon?: string
  showViewAll?: boolean
  viewAllLink?: string
  emptyMessage?: string
  limit?: number
  rowLink?: (row: any) => string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  showViewAll: false,
  viewAllLink: '',
  emptyMessage: 'Geen data beschikbaar',
  limit: 10
})

const i18n = useI18nStore()

const displayData = computed(() => {
  return props.data.slice(0, props.limit)
})

const formatValue = (column: Column, row: any) => {
  const value = row[column.key]

  if (column.format) {
    return column.format(value, row)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  switch (column.type) {
    case 'date':
      return new Date(value).toLocaleDateString(
        i18n.locale === 'nl' ? 'nl-NL' : 'en-US',
        { dateStyle: 'short' }
      )
    case 'datetime':
      return new Date(value).toLocaleString(
        i18n.locale === 'nl' ? 'nl-NL' : 'en-US',
        { dateStyle: 'short', timeStyle: 'short' }
      )
    case 'number':
      return value ?? 0
    default:
      return value
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <!-- Header -->
    <div v-if="title || showViewAll" class="flex items-center justify-between mb-4">
      <h2 v-if="title" class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <span v-if="icon" class="text-xl">{{ icon }}</span>
        {{ title }}
      </h2>
      <NuxtLink
        v-if="showViewAll && viewAllLink"
        :to="viewAllLink"
        class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {{ i18n.t('admin.viewAll') }}
      </NuxtLink>
    </div>

    <!-- Desktop Table -->
    <div v-if="displayData.length > 0" class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="(row, rowIndex) in displayData"
            :key="rowIndex"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-3 text-sm"
              :class="column.class || 'text-slate-500 dark:text-slate-400'"
            >
              <!-- Link type -->
              <NuxtLink
                v-if="column.type === 'link' && column.linkTo"
                :to="column.linkTo(row)"
                class="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {{ formatValue(column, row) }}
              </NuxtLink>
              <!-- Regular value -->
              <span v-else>{{ formatValue(column, row) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div v-if="displayData.length > 0" class="md:hidden space-y-3">
      <component
        :is="rowLink ? 'NuxtLink' : 'div'"
        v-for="(row, rowIndex) in displayData"
        :key="rowIndex"
        :to="rowLink ? rowLink(row) : undefined"
        class="block bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3"
        :class="{ 'hover:bg-slate-100 dark:hover:bg-slate-700': rowLink }"
      >
<!-- First column as title -->
        <div v-if="columns.length > 0" class="font-medium text-slate-900 dark:text-white mb-2">
          {{ formatValue(columns[0]!, row) }}
        </div>
        <!-- Other columns as details -->
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div v-for="column in columns.slice(1)" :key="column.key">
            <span class="text-xs text-slate-400 dark:text-slate-500 uppercase block">{{ column.label }}</span>
            <span class="text-slate-600 dark:text-slate-300">{{ formatValue(column, row) }}</span>
          </div>
        </div>
      </component>
    </div>

    <!-- Empty State -->
    <p v-if="displayData.length === 0" class="text-slate-500 dark:text-slate-400 text-center py-8">
      {{ emptyMessage }}
    </p>
  </div>
</template>

