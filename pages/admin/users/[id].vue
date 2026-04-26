<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import MonthSelector from '~/components/profile/MonthSelector.vue'
import Button from 'primevue/button'
import deleteModal from '~/components/deleteModal.vue'
import { useNotification } from '~/composables/useNotification'

definePageMeta({
  middleware: ['auth', 'admin']
})

const route = useRoute()
const i18n = useI18nStore()
const { getUserDetail, blockUser } = useAdminApi()
const { showNotification } = useNotification()

const loading = ref(true)
const loadingActivity = ref(false)
const error = ref<string | null>(null)
const data = ref<any>(null)
const blocking = ref(false)
const selectedMonth = ref('')
const availableMonths = ref<string[]>([])
const showBlockModal = ref(false)

const userId = computed(() => Number(route.params.id))

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
  availableMonths.value = generateAvailableMonths()
  selectedMonth.value = availableMonths.value[0]
  await loadUserData()
})

const loadUserData = async (month?: string, isMonthChange = false) => {
  if (isMonthChange) {
    loadingActivity.value = true
  } else {
    loading.value = true
  }
  error.value = null
  try {
    data.value = await getUserDetail(userId.value, month || selectedMonth.value)
    if (data.value.available_months?.length > 1) {
      availableMonths.value = data.value.available_months
      if (!month && data.value.available_months[0]) {
        selectedMonth.value = data.value.available_months[0]
      }
    }
  } catch (e: any) {
    error.value = e.message || i18n.t('errors.failedToLoadUserDetails')
  } finally {
    loading.value = false
    loadingActivity.value = false
  }
}

const onMonthChange = (month: string) => {
  selectedMonth.value = month
  loadUserData(month, true)
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

const blockModalTitle = computed(() =>
  data.value?.user?.blocked ? i18n.t('admin.unblock') : i18n.t('admin.block')
)
const blockModalContent = computed(() =>
  data.value?.user?.blocked ? i18n.t('admin.unblockConfirm') : i18n.t('admin.blockConfirm')
)
const blockModalButtonText = computed(() =>
  data.value?.user?.blocked ? i18n.t('admin.unblock') : i18n.t('admin.block')
)

const toggleBlockUser = () => {
  if (!data.value?.user) return
  showBlockModal.value = true
}

const confirmToggleBlock = async () => {
  showBlockModal.value = false
  blocking.value = true
  const newBlockedStatus = !data.value.user.blocked
  try {
    await blockUser(userId.value, newBlockedStatus)
    data.value.user.blocked = newBlockedStatus
  } catch (e: any) {
    showNotification(e.message || i18n.t('errors.failedToUpdateUser'))
  } finally {
    blocking.value = false
  }
}
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <!-- Page header -->
      <div class="pb-6">
        <PageHeader
          back-to="/admin/users"
          :title="data?.user?.name || '...'"
          :subtitle="data?.user?.email || undefined"
        />
        <div class="flex flex-wrap items-center gap-2 text-sm mt-4">
          <span class="px-2 py-1 border border-surface-200 text-color-secondary rounded text-xs">
            {{ i18n.t('admin.lastActive') }}: {{ formatDate(data?.user?.last_active, true) }}
          </span>
          <span v-if="data?.user?.email_verified_at" class="px-2 py-1 border border-surface-200 text-color-secondary rounded text-xs">
            {{ i18n.t('admin.emailVerified') }}
          </span>
          <span v-if="data?.user?.blocked" class="px-2 py-1 border border-surface-200 text-color-secondary rounded text-xs">
            {{ i18n.t('admin.blocked') }}
          </span>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20 text-color-secondary">
        <div class="text-center space-y-3">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-500 mx-auto"></div>
          <p>{{ i18n.t('common.loading') }}</p>
        </div>
      </div>

      <div v-else-if="error" class="border border-surface-200 text-color-secondary p-6 text-center rounded">
        {{ error }}
      </div>

      <template v-else-if="data">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- User info -->
          <div class="list-item-row rounded p-5">
            <h2 class="text-base font-medium mb-4">
              {{ i18n.t('admin.userInfo') }}
            </h2>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between gap-4 border-b border-surface-200 pb-3">
                <dt class="text-color-secondary">{{ i18n.t('admin.email') }}</dt>
                <dd class="font-medium">{{ data.user.email }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-surface-200 pb-3">
                <dt class="text-color-secondary">{{ i18n.t('admin.registered') }}</dt>
                <dd class="text-color-secondary">{{ formatDate(data.user.created_at) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-surface-200 pb-3">
                <dt class="text-color-secondary">{{ i18n.t('admin.emailVerified') }}</dt>
                <dd class="text-color-secondary">{{ data.user.email_verified_at ? formatDate(data.user.email_verified_at, true) : i18n.t('admin.no') }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-surface-200 pb-3">
                <dt class="text-color-secondary">{{ i18n.t('admin.lastActive') }}</dt>
                <dd class="text-color-secondary">{{ formatDate(data.user.last_active, true) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-surface-200 pb-3">
                <dt class="text-color-secondary">{{ i18n.t('admin.appVersion') }}</dt>
                <dd class="text-color-secondary">{{ data.user.terms_version || '-' }}</dd>
              </div>
              <div class="flex justify-between items-center gap-4">
                <dt class="text-color-secondary">{{ i18n.t('admin.status') }}</dt>
                <dd>
                  <span class="px-2 py-1 text-xs font-medium rounded border border-surface-200 text-color-secondary">
                    {{ data.user.blocked ? i18n.t('admin.blocked') : i18n.t('admin.active') }}
                  </span>
                </dd>
              </div>
            </dl>
            <div class="pt-4 mt-4 border-t border-surface-200">
              <Button
                :label="blocking ? '...' : (data.user.blocked ? i18n.t('admin.unblock') : i18n.t('admin.block'))"
                severity="secondary"
                :disabled="blocking"
                class="w-full"
                @click="toggleBlockUser"
              />
            </div>
          </div>

          <!-- Lists info -->
          <div class="list-item-row rounded p-5">
            <h2 class="text-base font-medium mb-4">
              {{ i18n.t('admin.listsInfo') }}
            </h2>
            <div class="flex divide-x divide-surface-200 border-t border-surface-200">
              <div class="flex-1 px-4 py-3 first:pl-0">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">{{ i18n.t('admin.ownedLists') }}</p>
                <p class="text-xl font-light">{{ data.lists.owned }}</p>
              </div>
              <div class="flex-1 px-4 py-3">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">{{ i18n.t('admin.sharedWithUser') }}</p>
                <p class="text-xl font-light">{{ data.lists.shared_with_user }}</p>
              </div>
              <div class="flex-1 px-4 py-3">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">{{ i18n.t('admin.totalAccess') }}</p>
                <p class="text-xl font-light">{{ data.lists.total_access }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="availableMonths.length" class="border-t border-surface-200 pt-4">
          <MonthSelector
            :selected-month="selectedMonth"
            :available-months="availableMonths"
            @change="onMonthChange"
          />
        </div>

        <!-- Items activity -->
        <div class="list-item-row rounded p-5">
          <h2 class="text-base font-medium mb-4">
            {{ i18n.t('admin.itemsActivity') }}
          </h2>
          <div v-if="loadingActivity" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-surface-200 border-t-surface-500"></div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6">
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
              :value="data.invalid_login_attempts?.current_month ?? 0"
              :previous-value="data.invalid_login_attempts?.previous_month ?? 0"
              :showPercentage="true"
            />
            <AdminStatsCard
              :title="i18n.t('admin.spendThisMonth')"
              :value="data?.spend?.current_month?.total ?? 0"
              :previous-value="data?.spend?.previous_month?.total ?? 0"
              :showPercentage="true"
              prefix="€"
            />
            <div class="border-b border-surface-200 py-4">
              <h3 class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
                {{ i18n.t('admin.previousMonth') }}
              </h3>
              <p class="mt-2 text-base text-color-secondary">
                {{ data.items?.previous_month?.added ?? 0 }} {{ i18n.t('admin.added') }},
                {{ data.items?.previous_month?.checked ?? 0 }} {{ i18n.t('admin.checked') }}
              </p>
              <p class="text-xs text-color-secondary mt-1">
                {{ data.items?.previous_month?.period }}
              </p>
            </div>
          </div>
        </div>

        <!-- User top items -->
        <div v-if="data.top_items" class="list-item-row rounded p-5">
          <h2 class="text-base font-medium mb-4">
            {{ i18n.t('admin.userTopItems') }}
          </h2>
          <div v-if="loadingActivity" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-surface-200 border-t-surface-500"></div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium mb-3">
                {{ i18n.t('admin.mostAdded') }}
              </h3>
              <ul v-if="data.top_items.current_month?.most_added?.length > 0" class="divide-y divide-surface-200">
                <li
                  v-for="(item, index) in data.top_items.current_month.most_added.slice(0, 5)"
                  :key="index"
                  class="flex justify-between items-center py-2 text-sm"
                >
                  <span class="text-color-secondary">
                    <span class="text-color-secondary font-medium mr-2">{{ index + 1 }}.</span>
                    {{ item.name }}
                  </span>
                  <span class="text-sm text-color-secondary font-medium">{{ item.count }}x</span>
                </li>
              </ul>
              <p v-else class="text-color-secondary text-sm">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>

            <div>
              <h3 class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium mb-3">
                {{ i18n.t('admin.mostChecked') }}
              </h3>
              <ul v-if="data.top_items.current_month?.most_checked?.length > 0" class="divide-y divide-surface-200">
                <li
                  v-for="(item, index) in data.top_items.current_month.most_checked.slice(0, 5)"
                  :key="index"
                  class="flex justify-between items-center py-2 text-sm"
                >
                  <span class="text-color-secondary">
                    <span class="text-color-secondary font-medium mr-2">{{ index + 1 }}.</span>
                    {{ item.name }}
                  </span>
                  <span class="text-sm text-color-secondary font-medium">{{ item.count }}x</span>
                </li>
              </ul>
              <p v-else class="text-color-secondary text-sm">
                {{ i18n.t('admin.noTopItems') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <deleteModal
    :is-visible="showBlockModal"
    :title="blockModalTitle"
    :content="blockModalContent"
    :delete-button-text="blockModalButtonText"
    :withValidation="false"
    @close="showBlockModal = false"
    @confirm="confirmToggleBlock"
  />
</template>
