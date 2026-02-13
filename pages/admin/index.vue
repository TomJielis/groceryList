<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import AdminLineChart from '~/components/admin/AdminLineChart.vue'
import AdminDoughnutChart from '~/components/admin/AdminDoughnutChart.vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const i18n = useI18nStore()
const { getStatsUsers, getStatsItems, getStatsLists, getStatsActivity, getStatsVersions } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)

const statsUsers = ref<any>(null)
const statsItems = ref<any>(null)
const statsLists = ref<any>(null)
const statsActivity = ref<any>(null)
const statsVersions = ref<any>(null)

onMounted(async () => {
  try {
    const [users, items, lists, activity, versions] = await Promise.all([
      getStatsUsers(),
      getStatsItems(),
      getStatsLists(),
      getStatsActivity(),
      getStatsVersions(),
    ])
    statsUsers.value = users
    statsItems.value = items
    statsLists.value = lists
    statsActivity.value = activity
    statsVersions.value = versions
  } catch (e: any) {
    error.value = e.message || 'Failed to load admin data'
  } finally {
    loading.value = false
  }
})

const activityLabels = computed(() => {
  if (!statsActivity.value?.current_month?.daily) return []
  return statsActivity.value.current_month.daily.map((d: any) => d.date.split('-')[2])
})

const activityDatasets = computed(() => {
  if (!statsActivity.value?.current_month?.daily) return []
  return [
    {
      label: i18n.t('admin.itemsAdded'),
      data: statsActivity.value.current_month.daily.map((d: any) => d.items_added),
      borderColor: '#3B82F6',
    },
    {
      label: i18n.t('admin.itemsChecked'),
      data: statsActivity.value.current_month.daily.map((d: any) => d.items_checked),
      borderColor: '#10B981',
    }
  ]
})

const versionLabels = computed(() => {
  if (!statsVersions.value?.current_month?.breakdown) return []
  return Object.keys(statsVersions.value.current_month.breakdown)
})

const versionData = computed(() => {
  if (!statsVersions.value?.current_month?.breakdown) return []
  return Object.values(statsVersions.value.current_month.breakdown).map((v: any) => v.count)
})
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="text-2xl">⚙️</span>
          <span>{{ i18n.t('admin.title') }}</span>
        </h1>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-24">
      <div class="max-w-5xl mx-auto px-4 py-6">
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
          <!-- User Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AdminStatsCard
              :title="i18n.t('admin.totalUsers')"
              :value="statsUsers?.current_month?.value ?? 0"
              :change="statsUsers?.change"
              :previous-value="statsUsers?.previous_month?.value"
            />
            <AdminStatsCard
              :title="i18n.t('admin.newUsers')"
              :value="statsUsers?.current_month?.breakdown?.new_registrations ?? 0"
            />
            <AdminStatsCard
              :title="i18n.t('admin.activeUsers')"
              :value="statsUsers?.current_month?.breakdown?.active ?? 0"
            />
            <AdminStatsCard
              :title="i18n.t('admin.verifiedEmails')"
              :value="statsUsers?.current_month?.breakdown?.verified_email ?? 0"
            />
          </div>

          <!-- Items & Lists Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AdminStatsCard
              :title="i18n.t('admin.itemsAdded')"
              :value="statsItems?.current_month?.breakdown?.added ?? 0"
              :change="statsItems?.change"
              :previous-value="statsItems?.previous_month?.breakdown?.added"
            />
            <AdminStatsCard
              :title="i18n.t('admin.itemsChecked')"
              :value="statsItems?.current_month?.breakdown?.checked ?? 0"
            />
            <AdminStatsCard
              :title="i18n.t('admin.listsCreated')"
              :value="statsLists?.current_month?.breakdown?.created ?? 0"
              :change="statsLists?.change"
            />
            <AdminStatsCard
              :title="i18n.t('admin.sharedLists')"
              :value="statsLists?.current_month?.breakdown?.shared ?? 0"
            />
          </div>

          <!-- Activity Chart -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('admin.dailyActivity') }} - {{ statsActivity?.current_month?.period }}
            </h2>
            <AdminLineChart
              v-if="activityLabels.length > 0"
              :labels="activityLabels"
              :datasets="activityDatasets"
            />
            <p v-else class="text-slate-500 dark:text-slate-400 text-center py-8">
              {{ i18n.t('admin.noActivityData') }}
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Versions Chart -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.versionDistribution') }}
              </h2>
              <p v-if="statsVersions?.current_month?.on_latest" class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {{ statsVersions.current_month.on_latest.percentage }}% {{ i18n.t('admin.onLatestVersion') }} ({{ statsVersions.current_month.latest_version }})
              </p>
              <AdminDoughnutChart
                v-if="versionLabels.length > 0"
                :labels="versionLabels"
                :data="versionData"
              />
              <p v-else class="text-slate-500 dark:text-slate-400 text-center py-8">
                {{ i18n.t('admin.noVersionData') }}
              </p>
            </div>

            <!-- Top Lists -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.topLists') }}
              </h2>
              <ul v-if="statsActivity?.current_month?.top_lists?.length > 0" class="divide-y divide-slate-200 dark:divide-slate-700">
                <li
                  v-for="(list, index) in statsActivity.current_month.top_lists"
                  :key="list.id"
                  class="py-3 flex justify-between items-center"
                >
                  <span class="text-slate-700 dark:text-slate-300">
                    <span class="font-medium text-slate-500 dark:text-slate-400 mr-2">{{ index + 1 }}.</span>
                    {{ list.name }}
                  </span>
                  <span class="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {{ list.items_added }} items
                  </span>
                </li>
              </ul>
              <p v-else class="text-slate-500 dark:text-slate-400 text-center py-8">
                {{ i18n.t('admin.noTopLists') }}
              </p>
            </div>
          </div>

          <!-- Link to users page -->
          <NuxtLink
            to="/admin/users"
            class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {{ i18n.t('admin.viewAllUsers') }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
