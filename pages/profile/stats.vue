<script setup lang="ts">
import { useUserStats } from '~/composables/useUserStats'
import { useI18nStore } from '~/stores/i18n'
import MonthSelector from '~/components/profile/MonthSelector.vue'
import ProfileItemsActivity from '~/components/profile/ProfileItemsActivity.vue'
import ProfileTopItems from '~/components/profile/ProfileTopItems.vue'

definePageMeta({
  middleware: ['auth', 'terms']
})

const i18n = useI18nStore()
const { getStats } = useUserStats()

const initialLoading = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<any>(null)
const selectedMonth = ref<string>('')
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

  try {
    const response = await getStats()
    data.value = response
    // Only use backend months if there are more than our generated fallback
    if (response.available_months?.length > 1) {
      availableMonths.value = response.available_months
      selectedMonth.value = response.selected_month || response.available_months[0]
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load stats'
  } finally {
    initialLoading.value = false
  }
})

async function onMonthChange(month: string) {
  selectedMonth.value = month // Update immediately for responsive UI
  loading.value = true
  error.value = null
  try {
    const response = await getStats(month)
    data.value = response
  } catch (e: any) {
    error.value = e.message || 'Failed to load stats'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <!-- Back Button -->
          <NuxtLink
            to="/profile"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>

          <!-- Title & Stats -->
          <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}
            </h1>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ i18n.t('profile.myStatsDescription') || 'Bekijk je item activiteit' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-24">
      <div class="max-w-5xl mx-auto px-4 py-4 space-y-6">
        <!-- Initial Loading State -->
        <div v-if="initialLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
          </div>
        </div>

        <!-- Error State (only for initial load) -->
        <div v-else-if="error && !data" class="text-center py-20">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Month Selector (always visible) -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- Error message for month change -->
          <div v-if="error && data" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Loading indicator for month change -->
          <div v-if="loading" class="flex items-center justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <template v-else-if="data">
            <!-- Items Activity Section -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('profile.itemsActivity') || 'Item Activiteit' }}
              </h2>
              <ProfileItemsActivity :items="data.items" :invalid_login_attempts="data.invalid_login_attempts" />
            </div>

            <!-- Top Items Section -->
            <div v-if="data.top_items" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('profile.topItems') || 'Top Items' }}
              </h2>
              <ProfileTopItems :top-items="data.top_items" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
