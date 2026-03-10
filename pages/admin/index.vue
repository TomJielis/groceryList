<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import AdminLineChart from '~/components/admin/AdminLineChart.vue'
import AdminDoughnutChart from '~/components/admin/AdminDoughnutChart.vue'
import DataTable from '~/components/DataTable.vue'
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

const userColumns = [
  {
    key: 'name',
    label: i18n.t('admin.name'),
    type: 'link' as const,
    linkTo: (row: any) => `/admin/users/${row.id}`,
    isPrimary: true,
    badges: (row: any) => {
      const badges = []
      if (row.email_verified) badges.push({ text: '✓', color: 'green' as const })
      if (row.blocked) badges.push({ text: i18n.t('admin.blocked'), color: 'red' as const })
      return badges
    }
  },
  { key: 'email', label: i18n.t('admin.email') },
  { key: 'created_at', label: i18n.t('admin.registered'), type: 'date' as const },
  { key: 'last_active', label: i18n.t('admin.lastActive'), type: 'datetime' as const, hideOnMobile: true },
  { key: 'lists_count', label: i18n.t('admin.lists'), type: 'number' as const },
  { key: 'terms_version', label: i18n.t('admin.version'), hideOnMobile: true },
]
</script>

<template>
  <div class="admin-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-8">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6 pb-20">
      <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 md:p-8 shadow-2xl space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/profile"
              class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <p class="text-[11px] uppercase tracking-[0.4em] text-slate-300">
                {{ i18n.t('admin.dashboard') || 'Dashboard' }}
              </p>
              <h1 class="text-3xl md:text-4xl font-bold">
                {{ i18n.t('admin.title') }}
              </h1>
              <p v-if="statsActivity?.current_month?.period" class="text-sm text-slate-300">
                {{ statsActivity.current_month.period }}
              </p>
            </div>
          </div>
          <div v-if="availableMonths.length" class="self-start md:self-auto">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.totalUsers') }}
            </p>
            <p class="text-2xl font-semibold">{{ statsUsers?.current_month?.value ?? 0 }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.itemsAdded') }}
            </p>
            <p class="text-2xl font-semibold text-emerald-300">
              {{ statsItems?.current_month?.breakdown?.added ?? 0 }}
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.listsCreated') }}
            </p>
            <p class="text-2xl font-semibold text-amber-300">
              {{ statsLists?.current_month?.breakdown?.created ?? 0 }}
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.activeUsers') }}
            </p>
            <p class="text-2xl font-semibold">
              {{ statsUsers?.current_month?.breakdown?.active ?? 0 }}
            </p>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminStatsCard
            :title="i18n.t('admin.totalUsers')"
            :value="statsUsers?.current_month?.value ?? 0"
            :previous-value="statsUsers?.previous_month?.value"
            :showPercentage="true"
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
            :previous-value="statsUsers?.previous_month?.breakdown?.invalid_login_attempts"
            :showPercentage="true"
          />
          <AdminStatsCard
            :title="i18n.t('admin.itemsAdded')"
            :value="statsItems?.current_month?.breakdown?.added ?? 0"
            :previous-value="statsItems?.previous_month?.breakdown?.added"
            :showPercentage="true"
          />
          <AdminStatsCard
            :title="i18n.t('admin.itemsChecked')"
            :value="statsItems?.current_month?.breakdown?.checked ?? 0"
            :previous-value="statsItems?.previous_month?.breakdown?.checked"
            :showPercentage="true"
          />
          <AdminStatsCard
            :title="i18n.t('admin.listsCreated')"
            :value="statsLists?.current_month?.breakdown?.created ?? 0"
            :previous-value="statsLists?.previous_month?.breakdown?.created"
            :showPercentage="true"
          />
          <AdminStatsCard
            :title="i18n.t('admin.sharedLists')"
            :value="statsLists?.current_month?.breakdown?.shared ?? 0"
            :previous-value="statsLists?.previous_month?.breakdown?.shared"
            :showPercentage="true"
          />
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 text-white shadow-2xl">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('admin.dailyActivity') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ statsActivity?.current_month?.period }}
            </p>
          </div>
          <AdminLineChart
            v-if="activityLabels.length > 0"
            :labels="activityLabels"
            :datasets="activityDatasets"
          />
          <p v-else class="text-slate-300 text-center py-8">
            {{ i18n.t('admin.noActivityData') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 text-white shadow-2xl">
            <h2 class="text-xl font-semibold mb-2">
              {{ i18n.t('admin.versionDistribution') }}
            </h2>
            <p v-if="statsVersions?.current_month?.on_latest" class="text-sm text-slate-300 mb-4">
              {{ statsVersions.current_month.on_latest.percentage }}% {{ i18n.t('admin.onLatestVersion') }}
              ({{ statsVersions.current_month.latest_version }})
            </p>
            <AdminDoughnutChart
              v-if="versionLabels.length > 0"
              :labels="versionLabels"
              :data="versionData"
            />
            <p v-else class="text-slate-300 text-center py-8">
              {{ i18n.t('admin.noVersionData') }}
            </p>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 text-white shadow-2xl">
            <h2 class="text-xl font-semibold mb-4">
              {{ i18n.t('admin.topLists') }}
            </h2>
            <ul v-if="statsActivity?.current_month?.top_lists?.length > 0" class="divide-y divide-white/10">
              <li
                v-for="(list, index) in statsActivity.current_month.top_lists"
                :key="list.id"
                class="py-3 flex justify-between items-center text-sm"
              >
                <span class="flex items-center gap-2 text-white/90">
                  <span class="text-slate-400 font-medium w-5 text-right">{{ index + 1 }}.</span>
                  {{ list.name }}
                </span>
                <span class="text-xs text-slate-900 bg-amber-300/90 px-2 py-1 rounded-full font-semibold">
                  {{ list.items_added }} {{ i18n.t('admin.itemsAdded') }}
                </span>
              </li>
            </ul>
            <p v-else class="text-slate-300 text-center py-8">
              {{ i18n.t('admin.noTopLists') }}
            </p>
          </div>
        </div>

        <DataTable
          :columns="userColumns"
          :data="recentlyActiveUsers"
          :title="i18n.t('admin.recentlyActiveUsers')"
          icon="👥"
          :show-view-all="true"
          view-all-link="/admin/users"
          :empty-message="i18n.t('admin.noActiveUsers')"
          :limit="10"
          :row-link="(row) => `/admin/users/${row.id}`"
        />

        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 text-white shadow-2xl">
          <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <span class="text-2xl">🏆</span>
              {{ i18n.t('admin.topItems') }}
            </h2>
            <NuxtLink
              to="/admin/top-items"
              class="text-sm text-emerald-300 hover:text-emerald-200 transition"
            >
              {{ i18n.t('admin.viewAll') }}
            </NuxtLink>
          </div>

          <p v-if="topItemsPeriod" class="text-xs text-slate-300 mb-4">
            {{ topItemsPeriod }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span class="text-emerald-300">+</span>
                {{ i18n.t('admin.mostAdded') }}
              </h3>
              <ol v-if="topItemsMostAdded.length > 0" class="space-y-3">
                <li
                  v-for="(item, index) in topItemsMostAdded.slice(0, 5)"
                  :key="index"
                  class="flex items-center justify-between text-sm bg-white/5 border border-white/10 rounded-2xl px-4 py-2"
                >
                  <span class="flex items-center gap-2 truncate">
                    <span class="text-slate-400 font-semibold w-4">{{ index + 1 }}.</span>
                    <span class="text-white truncate">{{ item.name }}</span>
                  </span>
                  <span class="text-xs font-semibold text-emerald-200">
                    {{ item.count }}×
                  </span>
                </li>
              </ol>
              <p v-else class="text-sm text-slate-300 italic">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span class="text-sky-300">✓</span>
                {{ i18n.t('admin.mostChecked') }}
              </h3>
              <ol v-if="topItemsMostChecked.length > 0" class="space-y-3">
                <li
                  v-for="(item, index) in topItemsMostChecked.slice(0, 5)"
                  :key="index"
                  class="flex items-center justify-between text-sm bg-white/5 border border-white/10 rounded-2xl px-4 py-2"
                >
                  <span class="flex items-center gap-2 truncate">
                    <span class="text-slate-400 font-semibold w-4">{{ index + 1 }}.</span>
                    <span class="text-white truncate">{{ item.name }}</span>
                  </span>
                  <span class="text-xs font-semibold text-sky-200">
                    {{ item.count }}×
                  </span>
                </li>
              </ol>
              <p v-else class="text-sm text-slate-300 italic">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
