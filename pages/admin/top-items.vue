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
  <div class="admin-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-8">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 md:p-8 shadow-2xl space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/admin"
              class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <p class="text-[11px] uppercase tracking-[0.4em] text-slate-300">
                {{ i18n.t('admin.analytics') || 'Insights' }}
              </p>
              <h1 class="text-3xl font-bold">
                {{ i18n.t('admin.topItems') }}
              </h1>
              <p class="text-sm text-slate-300">
                {{ periodLabel }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
            <button
              @click="selectedMonth = 'current'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-2xl transition',
                selectedMonth === 'current'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white/80 hover:text-white'
              ]"
            >
              {{ i18n.t('admin.currentMonth') }}
            </button>
            <button
              @click="selectedMonth = 'previous'"
              :class="[
                'px-4 py-2 text-sm font-semibold rounded-2xl transition',
                selectedMonth === 'previous'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white/80 hover:text-white'
              ]"
            >
              {{ i18n.t('admin.previousMonth') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20 text-white/80">
        <div class="text-center space-y-3">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-transparent mx-auto"></div>
          <p>{{ i18n.t('common.loading') }}</p>
        </div>
      </div>

      <div v-else-if="error" class="rounded-3xl border border-white/10 bg-rose-500/10 text-rose-100 p-6 text-center">
        {{ error }}
      </div>

      <template v-else>
        <p v-if="periodLabel" class="text-sm text-slate-300 text-center">
          {{ periodLabel }}
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                {{ i18n.t('admin.mostAdded') }}
              </h2>
              <span class="text-slate-300 text-sm">{{ mostAddedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-white/10">
                <thead class="bg-white/5">
                  <tr>
                    <th class="px-6 py-3 text-left text-[11px] uppercase tracking-[0.3em] text-slate-300">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[11px] uppercase tracking-[0.3em] text-slate-300">
                      {{ i18n.t('admin.count') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[11px] uppercase tracking-[0.3em] text-slate-300">
                      {{ i18n.t('admin.lists') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr v-for="(item, index) in mostAddedItems" :key="index" class="hover:bg-white/5">
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-emerald-200 font-semibold">
                      {{ item.count }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-slate-200">
                      {{ item.lists_count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostAddedItems.length === 0" class="text-center py-8 text-slate-300">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                {{ i18n.t('admin.mostChecked') }}
              </h2>
              <span class="text-slate-300 text-sm">{{ mostCheckedItems.length }} {{ i18n.t('admin.items') }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-white/10">
                <thead class="bg-white/5">
                  <tr>
                    <th class="px-6 py-3 text-left text-[11px] uppercase tracking-[0.3em] text-slate-300">
                      {{ i18n.t('admin.name') }}
                    </th>
                    <th class="px-6 py-3 text-left text-[11px] uppercase tracking-[0.3em] text-slate-300">
                      {{ i18n.t('admin.count') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr v-for="(item, index) in mostCheckedItems" :key="index" class="hover:bg-white/5">
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sky-200 font-semibold">
                      {{ item.count }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mostCheckedItems.length === 0" class="text-center py-8 text-slate-300">
              {{ i18n.t('admin.noTopItems') }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
