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
    error.value = e.message || i18n.t('errors.failedToLoadAdminData')
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
      borderColor: '#a1a1aa',
    },
    {
      label: i18n.t('admin.itemsChecked'),
      data: statsActivity.value.current_month.daily.map((d: any) => d.items_checked),
      borderColor: '#52525b',
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
  <div class="admin-shell px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6 pb-20">
      <!-- Page header -->
      <div class="border-b border-[#27272a] pb-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/profile"
              class="w-9 h-9 flex items-center justify-center border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
                {{ i18n.t('admin.dashboard') }}
              </p>
              <h1 class="text-2xl md:text-3xl font-medium text-[#fafafa]">
                {{ i18n.t('admin.title') }}
              </h1>
              <p v-if="statsActivity?.current_month?.period" class="text-sm text-[#71717a]">
                {{ statsActivity.current_month.period }}
              </p>
            </div>
          </div>
          <div v-if="availableMonths.length" class="w-full md:w-64">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>
        </div>
        <!-- Quick stats row -->
        <div class="grid grid-cols-2 md:grid-cols-4 border-t border-[#27272a] mt-6">
          <div class="px-0 pr-4 py-3 border-r border-b md:border-b-0 border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.totalUsers') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">{{ statsUsers?.current_month?.value ?? 0 }}</p>
          </div>
          <div class="px-4 py-3 border-b md:border-b-0 md:border-r border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.itemsAdded') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ statsItems?.current_month?.breakdown?.added ?? 0 }}
            </p>
          </div>
          <div class="px-0 pr-4 py-3 border-r border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.listsCreated') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ statsLists?.current_month?.breakdown?.created ?? 0 }}
            </p>
          </div>
          <div class="px-4 py-3">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.activeUsers') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ statsUsers?.current_month?.breakdown?.active ?? 0 }}
            </p>
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
        <!-- Stats cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
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

        <!-- Daily activity chart -->
        <div class="border-t border-[#27272a] pt-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 class="text-base font-medium text-[#fafafa]">
              {{ i18n.t('admin.dailyActivity') }}
            </h2>
            <p class="text-sm text-[#71717a]">
              {{ statsActivity?.current_month?.period }}
            </p>
          </div>
          <AdminLineChart
            v-if="activityLabels.length > 0"
            :labels="activityLabels"
            :datasets="activityDatasets"
          />
          <p v-else class="text-[#71717a] text-center py-8">
            {{ i18n.t('admin.noActivityData') }}
          </p>
        </div>

        <!-- Version + Top Lists -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="border-t border-[#27272a] pt-6">
            <h2 class="text-base font-medium text-[#fafafa] mb-2">
              {{ i18n.t('admin.versionDistribution') }}
            </h2>
            <p v-if="statsVersions?.current_month?.on_latest" class="text-sm text-[#71717a] mb-4">
              {{ statsVersions.current_month.on_latest.percentage }}% {{ i18n.t('admin.onLatestVersion') }}
              ({{ statsVersions.current_month.latest_version }})
            </p>
            <AdminDoughnutChart
              v-if="versionLabels.length > 0"
              :labels="versionLabels"
              :data="versionData"
            />
            <p v-else class="text-[#71717a] text-center py-8">
              {{ i18n.t('admin.noVersionData') }}
            </p>
          </div>

          <div class="border-t border-[#27272a] pt-6">
            <h2 class="text-base font-medium text-[#fafafa] mb-4">
              {{ i18n.t('admin.topLists') }}
            </h2>
            <ul v-if="statsActivity?.current_month?.top_lists?.length > 0" class="divide-y divide-[#27272a]">
              <li
                v-for="(list, index) in statsActivity.current_month.top_lists"
                :key="list.id"
                class="py-3 flex justify-between items-center text-sm"
              >
                <span class="flex items-center gap-2 text-[#a1a1aa]">
                  <span class="text-[#52525b] font-medium w-5 text-right">{{ index + 1 }}.</span>
                  {{ list.name }}
                </span>
                <span class="text-xs text-[#71717a] border border-[#3f3f46] px-2 py-1 rounded font-medium">
                  {{ list.items_added }} {{ i18n.t('admin.itemsAdded') }}
                </span>
              </li>
            </ul>
            <p v-else class="text-[#71717a] text-center py-8">
              {{ i18n.t('admin.noTopLists') }}
            </p>
          </div>
        </div>

        <!-- Recently active users table -->
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

        <!-- Top items section -->
        <div class="border-t border-[#27272a] pt-6">
          <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 class="text-base font-medium text-[#fafafa]">
              {{ i18n.t('admin.topItems') }}
            </h2>
            <NuxtLink
              to="/admin/top-items"
              class="text-sm text-[#71717a] hover:text-[#a1a1aa] transition"
            >
              {{ i18n.t('admin.viewAll') }}
            </NuxtLink>
          </div>

          <p v-if="topItemsPeriod" class="text-xs text-[#71717a] mb-4">
            {{ topItemsPeriod }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-3">
                {{ i18n.t('admin.mostAdded') }}
              </h3>
              <ol v-if="topItemsMostAdded.length > 0" class="divide-y divide-[#27272a]">
                <li
                  v-for="(item, index) in topItemsMostAdded.slice(0, 5)"
                  :key="index"
                  class="flex items-center justify-between text-sm py-2"
                >
                  <span class="flex items-center gap-2 truncate">
                    <span class="text-[#52525b] font-medium w-4">{{ index + 1 }}.</span>
                    <span class="text-[#a1a1aa] truncate">{{ item.name }}</span>
                  </span>
                  <span class="text-xs font-medium text-[#71717a]">
                    {{ item.count }}×
                  </span>
                </li>
              </ol>
              <p v-else class="text-sm text-[#71717a]">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>

            <div>
              <h3 class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium mb-3">
                {{ i18n.t('admin.mostChecked') }}
              </h3>
              <ol v-if="topItemsMostChecked.length > 0" class="divide-y divide-[#27272a]">
                <li
                  v-for="(item, index) in topItemsMostChecked.slice(0, 5)"
                  :key="index"
                  class="flex items-center justify-between text-sm py-2"
                >
                  <span class="flex items-center gap-2 truncate">
                    <span class="text-[#52525b] font-medium w-4">{{ index + 1 }}.</span>
                    <span class="text-[#a1a1aa] truncate">{{ item.name }}</span>
                  </span>
                  <span class="text-xs font-medium text-[#71717a]">
                    {{ item.count }}×
                  </span>
                </li>
              </ol>
              <p v-else class="text-sm text-[#71717a]">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
