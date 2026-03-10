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
</script>

<template>
  <div class="admin-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-8">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 md:p-8 shadow-2xl space-y-4">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/admin/users"
            class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div>
            <p class="text-[11px] uppercase tracking-[0.4em] text-slate-300">
              {{ i18n.t('admin.userDetail') }}
            </p>
            <h1 class="text-3xl font-bold truncate">
              {{ data?.user?.name || '...' }}
            </h1>
            <p class="text-sm text-slate-300">
              {{ data?.user?.email || '' }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <span class="px-3 py-1 rounded-full border border-white/20 bg-white/5">
            {{ i18n.t('admin.lastActive') }}: {{ formatDate(data?.user?.last_active, true) }}
          </span>
          <span class="px-3 py-1 rounded-full border border-emerald-300/20 bg-emerald-400/20 text-emerald-100" v-if="data?.user?.email_verified_at">
            {{ i18n.t('admin.emailVerified') }}
          </span>
          <span class="px-3 py-1 rounded-full border border-rose-300/20 bg-rose-400/20 text-rose-100" v-if="data?.user?.blocked">
            {{ i18n.t('admin.blocked') }}
          </span>
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

      <template v-else-if="data">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl p-6 space-y-4">
            <h2 class="text-xl font-semibold">
              {{ i18n.t('admin.userInfo') }}
            </h2>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.email') }}</dt>
                <dd class="font-semibold">{{ data.user.email }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.registered') }}</dt>
                <dd>{{ formatDate(data.user.created_at) }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.emailVerified') }}</dt>
                <dd>{{ data.user.email_verified_at ? formatDate(data.user.email_verified_at, true) : i18n.t('admin.no') }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.lastActive') }}</dt>
                <dd>{{ formatDate(data.user.last_active, true) }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.appVersion') }}</dt>
                <dd>{{ data.user.terms_version || '-' }}</dd>
              </div>
              <div class="flex justify-between items-center gap-4">
                <dt class="text-slate-300">{{ i18n.t('admin.status') || 'Status' }}</dt>
                <dd>
                  <span
                    v-if="data.user.blocked"
                    class="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-100 border border-rose-400/30"
                  >
                    {{ i18n.t('admin.blocked') }}
                  </span>
                  <span
                    v-else
                    class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                  >
                    {{ i18n.t('admin.active') || 'Active' }}
                  </span>
                </dd>
              </div>
            </dl>
            <div class="pt-4 border-t border-white/10">
              <button
                @click="toggleBlockUser"
                :disabled="blocking"
                class="w-full py-3 rounded-2xl font-semibold transition border"
                :class="data.user.blocked
                  ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-50 hover:bg-emerald-400/30'
                  : 'border-rose-300/40 bg-rose-400/20 text-rose-50 hover:bg-rose-400/30'"
              >
                <span v-if="blocking">...</span>
                <span v-else>{{ data.user.blocked ? i18n.t('admin.unblock') : i18n.t('admin.block') }}</span>
              </button>
            </div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl p-6 space-y-4">
            <h2 class="text-xl font-semibold">
              {{ i18n.t('admin.listsInfo') }}
            </h2>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-300">{{ i18n.t('admin.ownedLists') }}</dt>
                <dd class="font-semibold">{{ data.lists.owned }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-300">{{ i18n.t('admin.sharedWithUser') }}</dt>
                <dd class="font-semibold">{{ data.lists.shared_with_user }}</dd>
              </div>
              <div class="flex justify-between text-base font-semibold">
                <dt class="text-slate-200">{{ i18n.t('admin.totalAccess') }}</dt>
                <dd>{{ data.lists.total_access }}</dd>
              </div>
            </dl>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">{{ i18n.t('admin.ownedLists') }}</p>
                <p class="text-xl font-semibold">{{ data.lists.owned }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">{{ i18n.t('admin.sharedWithUser') }}</p>
                <p class="text-xl font-semibold">{{ data.lists.shared_with_user }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">{{ i18n.t('admin.totalAccess') }}</p>
                <p class="text-xl font-semibold text-amber-300">{{ data.lists.total_access }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="availableMonths.length" class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl p-4">
          <MonthSelector
            :selected-month="selectedMonth"
            :available-months="availableMonths"
            @change="onMonthChange"
          />
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl p-6 space-y-6">
          <h2 class="text-xl font-semibold">
            {{ i18n.t('admin.itemsActivity') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AdminStatsCard
              :title="i18n.t('admin.itemsAddedMonth')"
              :value="data.items?.current_month?.added ?? 0"
              :previous-value="data.items?.previous_month?.added"
              :showPercentage="true"
            />
            <AdminStatsCard
              :title="i18n.t('admin.itemsCheckedMonth')"
              :value="data.items?.current_month?.checked ?? 0"
              :previous-value="data.items?.previous_month?.checked"
              :showPercentage="true"
            />
            <AdminStatsCard
              :title="i18n.t('admin.invalidLoginAttempts')"
              :value="data.invalid_loggin_attempts?.current_month ?? 0"
              :previous-value="data.invalid_loggin_attempts?.previous_month ?? 0"
              :showPercentage="true"
            />
            <div class="rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
              <h3 class="text-sm font-semibold text-slate-300">
                {{ i18n.t('admin.previousMonth') }}
              </h3>
              <p class="mt-3 text-lg">
                {{ data.items?.previous_month?.added ?? 0 }} {{ i18n.t('admin.added') }},
                {{ data.items?.previous_month?.checked ?? 0 }} {{ i18n.t('admin.checked') }}
              </p>
              <p class="text-xs text-slate-400 mt-1">
                {{ data.items?.previous_month?.period }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="data.top_items" class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white shadow-2xl p-6 space-y-6">
          <h2 class="text-xl font-semibold">
            {{ i18n.t('admin.userTopItems') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-slate-300 mb-3">
                {{ i18n.t('admin.mostAdded') }}
              </h3>
              <ul v-if="data.top_items.current_month?.most_added?.length > 0" class="space-y-2">
                <li
                  v-for="(item, index) in data.top_items.current_month.most_added.slice(0, 5)"
                  :key="index"
                  class="flex justify-between items-center py-2 px-4 rounded-2xl border border-white/10 bg-white/5"
                >
                  <span class="text-white">
                    <span class="text-slate-400 font-semibold mr-2">{{ index + 1 }}.</span>
                    {{ item.name }}
                  </span>
                  <span class="text-sm text-emerald-200 font-semibold">
                    {{ item.count }}x
                  </span>
                </li>
              </ul>
              <p v-else class="text-slate-300 text-sm">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-slate-300 mb-3">
                {{ i18n.t('admin.mostChecked') }}
              </h3>
              <ul v-if="data.top_items.current_month?.most_checked?.length > 0" class="space-y-2">
                <li
                  v-for="(item, index) in data.top_items.current_month.most_checked.slice(0, 5)"
                  :key="index"
                  class="flex justify-between items-center py-2 px-4 rounded-2xl border border-white/10 bg-white/5"
                >
                  <span class="text-white">
                    <span class="text-slate-400 font-semibold mr-2">{{ index + 1 }}.</span>
                    {{ item.name }}
                  </span>
                  <span class="text-sm text-sky-200 font-semibold">
                    {{ item.count }}x
                  </span>
                </li>
              </ul>
              <p v-else class="text-slate-300 text-sm">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
