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
  <div class="admin-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <!-- Page header -->
      <div class="border-b border-[#27272a] pb-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/admin"
              class="w-9 h-9 flex items-center justify-center border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                {{ i18n.t('admin.analytics') }}
              </p>
              <h1 class="text-2xl md:text-3xl font-medium text-[#fafafa]">
                {{ i18n.t('admin.topItems') }}
              </h1>
              <p class="text-sm text-[#71717a]">
                {{ periodLabel }}
              </p>
            </div>
          </div>
          <!-- Month toggle -->
          <div class="flex items-center gap-1 border border-[#27272a] p-1 rounded self-start">
            <button
              @click="selectedMonth = 'current'"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded transition',
                selectedMonth === 'current'
                  ? 'bg-[#fafafa] text-[#18181b]'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              ]"
            >
              {{ i18n.t('admin.currentMonth') }}
            </button>
            <button
              @click="selectedMonth = 'previous'"
              :class="[
                'px-4 py-1.5 text-sm font-medium rounded transition',
                selectedMonth === 'previous'
                  ? 'bg-[#fafafa] text-[#18181b]'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              ]"
            >
              {{ i18n.t('admin.previousMonth') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20 text-[#71717a]">
        <div class="text-center space-y-3">
          <div class="animate-spin h-8 w-8 border border-[#3f3f46] border-t-[#a1a1aa] rounded mx-auto"></div>
          <p>{{ i18n.t('common.loading') }}</p>
        </div>
      </div>

      <div v-else-if="error" class="border border-[#27272a] text-[#a1a1aa] p-6 text-center rounded">
        {{ error }}
      </div>

      <template v-else>
        <p v-if="periodLabel" class="text-sm text-[#71717a] text-center">
          {{ periodLabel }}
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Most added table -->
          <div class="overflow-hidden">
            <div class="flex items-center justify-between py-3 border-b border-[#27272a]">
              <h2 class="text-base font-medium text-[#fafafa]">
                {{ i18n.t('admin.mostAdded') }}
              </h2>
              <span class="text-[#71717a] text-sm">{{ mostAddedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-0 pr-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                      {{ i18n.t('admin.count') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                      {{ i18n.t('admin.lists') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in mostAddedItems" :key="index" class="border-b border-[#27272a] hover:bg-[#1e1e21]">
                    <td class="px-0 pr-6 py-3 whitespace-nowrap font-medium text-[#fafafa] text-sm">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-[#a1a1aa] text-sm">
                      {{ item.count }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-[#71717a] text-sm">
                      {{ item.lists_count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostAddedItems.length === 0" class="text-center py-8 text-[#71717a]">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>

          <!-- Most checked table -->
          <div class="overflow-hidden">
            <div class="flex items-center justify-between py-3 border-b border-[#27272a]">
              <h2 class="text-base font-medium text-[#fafafa]">
                {{ i18n.t('admin.mostChecked') }}
              </h2>
              <span class="text-[#71717a] text-sm">{{ mostCheckedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-0 pr-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                      {{ i18n.t('admin.count') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in mostCheckedItems" :key="index" class="border-b border-[#27272a] hover:bg-[#1e1e21]">
                    <td class="px-0 pr-6 py-3 whitespace-nowrap font-medium text-[#fafafa] text-sm">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-[#a1a1aa] text-sm">
                      {{ item.count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostCheckedItems.length === 0" class="text-center py-8 text-[#71717a]">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
