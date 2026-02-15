<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import MonthSelector from '~/components/profile/MonthSelector.vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const route = useRoute()
const i18n = useI18nStore()
const { getUserDetail, blockUser } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>(null)
const blocking = ref(false)
const selectedMonth = ref('')
const availableMonths = ref<string[]>([])

const userId = computed(() => Number(route.params.id))

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
  await loadUserData()
})

const loadUserData = async (month?: string) => {
  loading.value = true
  error.value = null
  try {
    data.value = await getUserDetail(userId.value, month || selectedMonth.value)
    // Only use backend months if there are more than our generated fallback
    if (data.value.available_months?.length > 1) {
      availableMonths.value = data.value.available_months
      if (!month && data.value.available_months[0]) {
        selectedMonth.value = data.value.available_months[0]
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load user details'
  } finally {
    loading.value = false
  }
}

const onMonthChange = (month: string) => {
  selectedMonth.value = month
  loadUserData(month)
}

const formatDate = (date: string | null, includeTime = false) => {
  if (!date) return '-'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return new Date(date).toLocaleDateString(i18n.locale === 'nl' ? 'nl-NL' : 'en-US', options)
}

const toggleBlockUser = async () => {
  if (!data.value?.user) return

  const newBlockedStatus = !data.value.user.blocked
  const confirmMessage = newBlockedStatus
    ? i18n.t('admin.blockConfirm')
    : i18n.t('admin.unblockConfirm')

  if (!confirm(confirmMessage)) return

  blocking.value = true
  try {
    await blockUser(userId.value, newBlockedStatus)
    data.value.user.blocked = newBlockedStatus
  } catch (e: any) {
    alert(e.message || 'Failed to update user')
  } finally {
    blocking.value = false
  }
}

// Calculate percentage change
const calculateChange = (current: number, previous: number) => {
  const absolute = current - previous
  let percentage: number
  if (previous > 0) {
    percentage = Math.round((absolute / previous) * 100)
  } else if (current > 0) {
    percentage = 100
  } else {
    percentage = 0
  }
  return { absolute, percentage }
}

const addedChange = computed(() => {
  const current = data.value?.items?.current_month?.added ?? 0
  const previous = data.value?.items?.previous_month?.added ?? 0
  return calculateChange(current, previous)
})

const checkedChange = computed(() => {
  const current = data.value?.items?.current_month?.checked ?? 0
  const previous = data.value?.items?.previous_month?.checked ?? 0
  return calculateChange(current, previous)
})
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <NuxtLink
          to="/admin/users"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1 mb-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          {{ i18n.t('admin.backToUsers') }}
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="text-2xl">👤</span>
          <span>{{ data?.user?.name || i18n.t('admin.userDetail') }}</span>
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
        <template v-else-if="data">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- User Info -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.userInfo') }}
              </h2>
              <dl class="divide-y divide-slate-200 dark:divide-slate-700">
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.email') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.user.email }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.registered') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ formatDate(data.user.created_at) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.emailVerified') }}</dt>
                  <dd class="text-slate-900 dark:text-white">
                    {{ data.user.email_verified_at ? formatDate(data.user.email_verified_at, true) : i18n.t('admin.no') }}
                  </dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.lastActive') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ formatDate(data.user.last_active, true) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.appVersion') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ data.user.terms_version || '-' }}</dd>
                </div>
                <div class="py-3 flex justify-between items-center">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.status') || 'Status' }}</dt>
                  <dd>
                    <span
                      v-if="data.user.blocked"
                      class="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 rounded-full"
                    >{{ i18n.t('admin.blocked') }}</span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-full"
                    >{{ i18n.t('admin.active') || 'Active' }}</span>
                  </dd>
                </div>
              </dl>

              <!-- Block/Unblock Button -->
              <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  @click="toggleBlockUser"
                  :disabled="blocking"
                  class="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                  :class="data.user.blocked
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'"
                >
                  <span v-if="blocking">...</span>
                  <span v-else>{{ data.user.blocked ? i18n.t('admin.unblock') : i18n.t('admin.block') }}</span>
                </button>
              </div>
            </div>

            <!-- Lists Info -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.listsInfo') }}
              </h2>
              <dl class="divide-y divide-slate-200 dark:divide-slate-700">
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.ownedLists') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.lists.owned }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.sharedWithUser') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.lists.shared_with_user }}</dd>
                </div>
                <div class="py-3 flex justify-between font-semibold">
                  <dt class="text-slate-700 dark:text-slate-300">{{ i18n.t('admin.totalAccess') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ data.lists.total_access }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Month Selector -->
          <div v-if="availableMonths.length" class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- Items Activity -->
          <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('admin.itemsActivity') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <AdminStatsCard
                :title="i18n.t('admin.itemsAddedMonth')"
                :value="data.items?.current_month?.added ?? 0"
                :change="addedChange"
                :previous-value="data.items?.previous_month?.added"
              />
              <AdminStatsCard
                :title="i18n.t('admin.itemsCheckedMonth')"
                :value="data.items?.current_month?.checked ?? 0"
                :change="checkedChange"
                :previous-value="data.items?.previous_month?.checked"
              />
              <AdminStatsCard
                :title="i18n.t('admin.invalidLoginAttempts')"
                :value="data.invalid_loggin_attempts?.current_month ?? 0"
                :change="checkedChange"
                :previous-value="data.invalid_loggin_attempts?.previous_month ?? 0"
              />
              <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {{ i18n.t('admin.previousMonth') }} ({{ data.items?.previous_month?.period }})
                </h3>
                <p class="mt-2 text-lg text-slate-700 dark:text-slate-300">
                  {{ data.items?.previous_month?.added ?? 0 }} {{ i18n.t('admin.added') }},
                  {{ data.items?.previous_month?.checked ?? 0 }} {{ i18n.t('admin.checked') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Top Items -->
          <div v-if="data.top_items" class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('admin.userTopItems') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Most Added -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {{ i18n.t('admin.mostAdded') }}
                </h3>
                <ul v-if="data.top_items.current_month?.most_added?.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in data.top_items.current_month.most_added.slice(0, 5)"
                    :key="index"
                    class="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <span class="text-slate-700 dark:text-slate-300">
                      <span class="font-medium text-slate-400 dark:text-slate-500 mr-2">{{ index + 1 }}.</span>
                      {{ item.name }}
                    </span>
                    <span class="text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {{ item.count }}x
                    </span>
                  </li>
                </ul>
                <p v-else class="text-slate-500 dark:text-slate-400 text-sm">
                  {{ i18n.t('admin.noTopItems') }}
                </p>
              </div>

              <!-- Most Checked -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {{ i18n.t('admin.mostChecked') }}
                </h3>
                <ul v-if="data.top_items.current_month?.most_checked?.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in data.top_items.current_month.most_checked.slice(0, 5)"
                    :key="index"
                    class="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <span class="text-slate-700 dark:text-slate-300">
                      <span class="font-medium text-slate-400 dark:text-slate-500 mr-2">{{ index + 1 }}.</span>
                      {{ item.name }}
                    </span>
                    <span class="text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {{ item.count }}x
                    </span>
                  </li>
                </ul>
                <p v-else class="text-slate-500 dark:text-slate-400 text-sm">
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
