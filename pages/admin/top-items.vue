<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'

definePageMeta({
  middleware: ['auth', 'admin']
})

const i18n = useI18nStore()
const { getStatsTopItems } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>(null)
const selectedMonth = ref<'current' | 'previous'>('current')

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    data.value = await getStatsTopItems(selectedMonth.value === 'previous' ? 'previous' : undefined)
  } catch (e: any) {
    error.value = e.message || 'Failed to load top items data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(selectedMonth, () => {
  loadData()
})

const mostAddedItems = computed(() => {
  if (selectedMonth.value === 'current') {
    return data.value?.current_month?.most_added || []
  }
  return data.value?.previous_month?.most_added || []
})

const mostCheckedItems = computed(() => {
  if (selectedMonth.value === 'current') {
    return data.value?.current_month?.most_checked || []
  }
  return data.value?.previous_month?.most_checked || []
})

const periodLabel = computed(() => {
  if (selectedMonth.value === 'current') {
    return data.value?.current_month?.period || ''
  }
  return data.value?.previous_month?.period || ''
})
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <NuxtLink
              to="/admin"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1 mb-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              {{ i18n.t('admin.backToDashboard') }}
            </NuxtLink>
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="text-2xl">📊</span>
              <span>{{ i18n.t('admin.topItems') }}</span>
            </h1>
          </div>

          <!-- Month Toggle -->
          <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              @click="selectedMonth = 'current'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                selectedMonth === 'current'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              {{ i18n.t('admin.currentMonth') }}
            </button>
            <button
              @click="selectedMonth = 'previous'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                selectedMonth === 'previous'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              {{ i18n.t('admin.previousMonth') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-24">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') }}</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Content -->
        <template v-else>
          <p v-if="periodLabel" class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {{ periodLabel }}
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Most Added Table -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ i18n.t('admin.mostAdded') }}
                </h2>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {{ i18n.t('admin.name') }}
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {{ i18n.t('admin.count') }}
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {{ i18n.t('admin.lists') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr v-for="(item, index) in mostAddedItems" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="font-medium text-slate-900 dark:text-white">{{ item.name }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {{ item.count }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {{ item.lists_count }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="mostAddedItems.length === 0" class="text-center py-8">
                <p class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.noTopItems') }}</p>
              </div>
            </div>

            <!-- Most Checked Table -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ i18n.t('admin.mostChecked') }}
                </h2>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {{ i18n.t('admin.name') }}
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {{ i18n.t('admin.count') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr v-for="(item, index) in mostCheckedItems" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="font-medium text-slate-900 dark:text-white">{{ item.name }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {{ item.count }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="mostCheckedItems.length === 0" class="text-center py-8">
                <p class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.noTopItems') }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
