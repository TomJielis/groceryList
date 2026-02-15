<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface Column {
  key: string
  label: string
  type?: 'text' | 'date' | 'datetime' | 'link' | 'number' | 'badge'
  linkTo?: (row: any) => string
  format?: (value: any, row: any) => string
  class?: string
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  isPrimary?: boolean
  badges?: (row: any) => { text: string; color: 'green' | 'red' | 'blue' | 'yellow' }[]
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
  rowLinkLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  showViewAll: false,
  viewAllLink: '',
  emptyMessage: 'Geen data beschikbaar',
  limit: 0,
  rowLinkLabel: ''
})

const i18n = useI18nStore()

const displayData = computed(() => {
  if (props.limit > 0) {
    return props.data.slice(0, props.limit)
  }
  return props.data
})

// Get primary column (first column or one marked as isPrimary)
const primaryColumn = computed(() => {
  return props.columns.find(c => c.isPrimary) || props.columns[0]
})

// Get secondary columns for mobile view (exclude primary)
const mobileColumns = computed(() => {
  return props.columns.filter(c => c !== primaryColumn.value && !c.hideOnMobile)
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
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    <!-- Header -->
    <div v-if="title || showViewAll" class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
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

    <!-- Empty State -->
    <div v-if="displayData.length === 0" class="text-center py-12">
      <p class="text-slate-500 dark:text-slate-400">{{ emptyMessage }}</p>
    </div>

    <!-- Desktop Table -->
    <table v-else class="min-w-full divide-y divide-slate-200 dark:divide-slate-700 hidden md:table">
      <thead class="bg-slate-50 dark:bg-slate-900">
        <tr>
          <th
            v-for="column in columns.filter(c => !c.hideOnTablet)"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            :class="{ 'hidden lg:table-cell': column.hideOnMobile }"
          >
            {{ column.label }}
          </th>
          <th v-if="rowLink" class="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
        <tr
          v-for="(row, rowIndex) in displayData"
          :key="rowIndex"
          class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <td
            v-for="column in columns.filter(c => !c.hideOnTablet)"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm"
            :class="[
              column.class || 'text-slate-500 dark:text-slate-400',
              { 'hidden lg:table-cell': column.hideOnMobile }
            ]"
          >
            <!-- Link type -->
            <div v-if="column.type === 'link' && column.linkTo" class="flex items-center gap-2">
              <NuxtLink
                :to="column.linkTo(row)"
                class="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {{ formatValue(column, row) }}
              </NuxtLink>
              <!-- Badges -->
              <template v-if="column.badges">
                <span
                  v-for="(badge, idx) in column.badges(row)"
                  :key="idx"
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400': badge.color === 'green',
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400': badge.color === 'red',
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400': badge.color === 'blue',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400': badge.color === 'yellow'
                  }"
                >
                  {{ badge.text }}
                </span>
              </template>
            </div>
            <!-- Regular value -->
            <span v-else>{{ formatValue(column, row) }}</span>
          </td>
          <td v-if="rowLink" class="px-6 py-4 whitespace-nowrap">
            <NuxtLink
              :to="rowLink(row)"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              {{ rowLinkLabel || i18n.t('admin.details') }}
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile Cards -->
    <div v-if="displayData.length > 0" class="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
      <div
        v-for="(row, rowIndex) in displayData"
        :key="rowIndex"
        class="p-4"
      >
        <!-- Primary Row (title + action) -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-semibold text-slate-900 dark:text-white">
              {{ formatValue(primaryColumn!, row) }}
            </span>
            <!-- Badges from primary column -->
            <template v-if="primaryColumn?.badges">
              <span
                v-for="(badge, idx) in primaryColumn.badges(row)"
                :key="idx"
                class="px-2 py-0.5 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400': badge.color === 'green',
                  'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400': badge.color === 'red',
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400': badge.color === 'blue',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400': badge.color === 'yellow'
                }"
              >
                {{ badge.text }}
              </span>
            </template>
          </div>
          <NuxtLink
            v-if="rowLink"
            :to="rowLink(row)"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex-shrink-0"
          >
            {{ rowLinkLabel || i18n.t('admin.details') }}
          </NuxtLink>
        </div>

        <!-- Secondary info (like email) - show second column if it exists -->
        <p
          v-if="columns[1] && !columns[1].hideOnMobile"
          class="text-slate-500 dark:text-slate-400 text-sm mb-3 break-all"
        >
          {{ formatValue(columns[1], row) }}
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div
            v-for="column in mobileColumns.slice(1)"
            :key="column.key"
            class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2"
          >
            <p class="text-xs text-slate-400 dark:text-slate-500 uppercase">{{ column.label }}</p>
            <p class="text-slate-700 dark:text-slate-300 font-medium">{{ formatValue(column, row) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

