<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import AdminLineChart from '~/components/admin/AdminLineChart.vue'
import AdminDoughnutChart from '~/components/admin/AdminDoughnutChart.vue'
import MonthSelector from '~/components/profile/MonthSelector.vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const i18n = useI18nStore()
const { getStatsUsers, getStatsItems, getStatsLists, getStatsActivity, getStatsVersions, getStatsTopItems, getUsers } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)

const statsUsers = ref<any>(null)
const statsItems = ref<any>(null)
const statsLists = ref<any>(null)
const statsActivity = ref<any>(null)
const statsVersions = ref<any>(null)
const statsTopItems = ref<any>(null)
const allUsers = ref<any[]>([])
const selectedMonth = ref('')
const availableMonths = ref<string[]>([])

// Generate last 12 months as fallback
const generateAvailableMonths = () => {
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    months.push(`${year}-${month}`)
  }
  return months
}

onMounted(async () => {
  // Initialize with generated months
  availableMonths.value = generateAvailableMonths()
  selectedMonth.value = availableMonths.value[0]
  await loadData()
})

const loadData = async (month?: string) => {
  loading.value = true
  error.value = null
  try {
    const monthParam = month || selectedMonth.value
    const [users, items, lists, activity, versions, topItems, usersData] = await Promise.all([
      getStatsUsers(monthParam),
      getStatsItems(monthParam),
      getStatsLists(monthParam),
      getStatsActivity(monthParam),
      getStatsVersions(monthParam),
      getStatsTopItems(monthParam),
      getUsers(),
    ])
    statsUsers.value = users
    statsItems.value = items
    statsLists.value = lists
    statsActivity.value = activity
    statsVersions.value = versions
    statsTopItems.value = topItems
    allUsers.value = usersData.users || []
  } catch (e: any) {
    error.value = e.message || 'Failed to load admin data'
  } finally {
    loading.value = false
  }
}

const onMonthChange = (month: string) => {
  selectedMonth.value = month
  loadData(month)
}

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

const topItemsMostAdded = computed(() => {
  return statsTopItems.value?.current_month?.most_added || []
})

const topItemsMostChecked = computed(() => {
  return statsTopItems.value?.current_month?.most_checked || []
})

const topItemsPeriod = computed(() => {
  return statsTopItems.value?.current_month?.period || ''
})

const recentlyActiveUsers = computed(() => {
  if (!allUsers.value.length) return []
  return [...allUsers.value]
    .filter(u => u.last_active)
    .sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime())
    .slice(0, 10)
})

const invalidLoginAttemptsChange = computed(() => {
  const current = statsUsers.value?.current_month?.breakdown?.invalid_login_attempts ?? 0
  const previous = statsUsers.value?.previous_month?.breakdown?.invalid_login_attempts ?? 0
  const absolute = current - previous
  const percentage = previous > 0 ? Math.round((current / previous) * 100) : null
  return {
    absolute,
    percentage,
  }
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
          <!-- Month Selector -->
          <div v-if="availableMonths.length" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-8">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- User Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
            <AdminStatsCard
                :title="i18n.t('admin.invalidLoginAttempts')"
                :value="statsUsers?.current_month?.breakdown?.invalid_login_attempts ?? 0"
                :change="invalidLoginAttemptsChange"
                :previous-value="statsUsers?.previous_month?.breakdown?.invalid_login_attempts"
            />

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

            <!-- Active Users -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="text-xl">👥</span>
                  {{ i18n.t('admin.recentlyActiveUsers') }}
                </h2>
                <NuxtLink
                  to="/admin/users"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ i18n.t('admin.viewAll') }}
                </NuxtLink>
              </div>
              <ul v-if="recentlyActiveUsers.length > 0" class="space-y-2">
                <li
                  v-for="user in recentlyActiveUsers"
                  :key="user.id"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                  >
                    {{ user.name }}
                  </NuxtLink>
                </li>
              </ul>
              <p v-else class="text-slate-500 dark:text-slate-400 text-center py-8">
                {{ i18n.t('admin.noActiveUsers') }}
              </p>
            </div>
          </div>

          <!-- Top Items Widget -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="text-xl">🏆</span>
                {{ i18n.t('admin.topItems') }}
              </h2>
              <NuxtLink
                to="/admin/top-items"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ i18n.t('admin.viewAll') }}
              </NuxtLink>
            </div>

            <p v-if="topItemsPeriod" class="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {{ topItemsPeriod }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Most Added -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <span class="text-green-500">+</span>
                  {{ i18n.t('admin.mostAdded') }}
                </h3>
                <ol v-if="topItemsMostAdded.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in topItemsMostAdded.slice(0, 5)"
                    :key="index"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="flex items-center gap-2 truncate">
                      <span class="text-slate-400 dark:text-slate-500 font-medium w-4">{{ index + 1 }}.</span>
                      <span class="text-slate-700 dark:text-slate-300 truncate">{{ item.name }}</span>
                    </span>
                    <span class="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs ml-2 flex-shrink-0">
                      {{ item.count }}×
                    </span>
                  </li>
                </ol>
                <p v-else class="text-sm text-slate-400 dark:text-slate-500 italic">
                  {{ i18n.t('admin.noTopItems') }}
                </p>
              </div>

              <!-- Most Checked -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <span class="text-blue-500">✓</span>
                  {{ i18n.t('admin.mostChecked') }}
                </h3>
                <ol v-if="topItemsMostChecked.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in topItemsMostChecked.slice(0, 5)"
                    :key="index"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="flex items-center gap-2 truncate">
                      <span class="text-slate-400 dark:text-slate-500 font-medium w-4">{{ index + 1 }}.</span>
                      <span class="text-slate-700 dark:text-slate-300 truncate">{{ item.name }}</span>
                    </span>
                    <span class="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs ml-2 flex-shrink-0">
                      {{ item.count }}×
                    </span>
                  </li>
                </ol>
                <p v-else class="text-sm text-slate-400 dark:text-slate-500 italic">
                  {{ i18n.t('admin.noTopItems') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
