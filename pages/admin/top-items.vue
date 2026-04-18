<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import SelectButton from 'primevue/selectbutton'

definePageMeta({
  middleware: ['auth', 'admin']
})

const i18n = useI18nStore()
const { getStatsTopItems } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>(null)
const selectedMonth = ref<'current' | 'previous'>('current')

const monthOptions = [
  { label: i18n.t('admin.currentMonth'), value: 'current' },
  { label: i18n.t('admin.previousMonth'), value: 'previous' },
]

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    data.value = await getStatsTopItems(selectedMonth.value === 'previous' ? 'previous' : undefined)
  } catch (e: any) {
    error.value = e.message || i18n.t('errors.failedToLoadTopItems')
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
  <div class="px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <!-- Page header -->
      <div class="border-b border-surface-200 pb-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/admin"
              class="w-9 h-9 flex items-center justify-center border border-surface-200 text-color-secondary hover:border-surface-400 hover:text-color transition rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <h1 class="page-heading">
                {{ i18n.t('admin.topItems') }}
              </h1>
              <p class="text-sm text-color-secondary">
                {{ periodLabel }}
              </p>
            </div>
          </div>
          <!-- Month toggle -->
          <div class="self-start">
            <SelectButton
              v-model="selectedMonth"
              :options="monthOptions"
              optionLabel="label"
              optionValue="value"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20 text-color-secondary">
        <div class="text-center space-y-3">
          <div class="animate-spin h-8 w-8 border border-surface-200 border-t-surface-400 rounded mx-auto"></div>
          <p>{{ i18n.t('common.loading') }}</p>
        </div>
      </div>

      <div v-else-if="error" class="border border-surface-200 text-color-secondary p-6 text-center rounded">
        {{ error }}
      </div>

      <template v-else>
        <p v-if="periodLabel" class="text-sm text-color-secondary text-center">
          {{ periodLabel }}
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Most added table -->
          <div class="overflow-hidden">
            <div class="flex items-center justify-between py-3 border-b border-surface-200">
              <h2 class="text-base font-medium">
                {{ i18n.t('admin.mostAdded') }}
              </h2>
              <span class="text-color-secondary text-sm">{{ mostAddedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-0 pr-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                      {{ i18n.t('admin.count') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                      {{ i18n.t('admin.lists') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in mostAddedItems" :key="index" class="border-b border-surface-200 hover:bg-surface-50">
                    <td class="px-0 pr-6 py-3 whitespace-nowrap font-medium text-sm">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-color-secondary text-sm">
                      {{ item.count }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-color-secondary text-sm">
                      {{ item.lists_count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostAddedItems.length === 0" class="text-center py-8 text-color-secondary">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>

          <!-- Most checked table -->
          <div class="overflow-hidden">
            <div class="flex items-center justify-between py-3 border-b border-surface-200">
              <h2 class="text-base font-medium">
                {{ i18n.t('admin.mostChecked') }}
              </h2>
              <span class="text-color-secondary text-sm">{{ mostCheckedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-0 pr-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                      {{ i18n.t('admin.count') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in mostCheckedItems" :key="index" class="border-b border-surface-200 hover:bg-surface-50">
                    <td class="px-0 pr-6 py-3 whitespace-nowrap font-medium text-sm">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-color-secondary text-sm">
                      {{ item.count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostCheckedItems.length === 0" class="text-center py-8 text-color-secondary">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
