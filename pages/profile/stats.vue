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
  <div class="stats-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div class="stats-hero rounded-3xl border border-white/10 shadow-2xl p-6 text-white space-y-4">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/profile"
            class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div>
            <p class="text-xs uppercase tracking-[0.4em] text-slate-300">
              {{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}
            </p>
            <h1 class="text-3xl font-bold">
              {{ i18n.t('profile.myStatsDescription') || 'Bekijk je item activiteit' }}
            </h1>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="stats-chip">
            <p>{{ i18n.t('profile.itemsActivity') || 'Items' }}</p>
            <span>24</span>
          </div>
          <div class="stats-chip">
            <p>{{ i18n.t('profile.topItems') || 'Top Items' }}</p>
            <span>5</span>
          </div>
          <div class="stats-chip">
            <p>{{ i18n.t('profile.language') || 'Maand' }}</p>
            <span>{{ selectedMonth?.replace('-', '/') }}</span>
          </div>
          <div class="stats-chip">
            <p>{{ i18n.t('common.status') || 'Status' }}</p>
            <span>{{ loading ? '…' : 'Live' }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
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
          <div class="stats-card">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- Error message for month change -->
          <div v-if="error && data" class="bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4">
            <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Loading indicator for month change -->
          <div v-if="loading" class="flex items-center justify-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <template v-else-if="data">
            <!-- Items Activity Section -->
            <div class="stats-card">
              <h2 class="section-title">
                {{ i18n.t('profile.itemsActivity') || 'Item Activiteit' }}
              </h2>
              <ProfileItemsActivity :items="data.items" :invalid_login_attempts="data.invalid_login_attempts" />
            </div>

            <!-- Top Items Section -->
            <div v-if="data.top_items" class="stats-card">
              <h2 class="section-title">
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

<style scoped>
.stats-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.stats-hero {
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.35), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(30px);
}

.stats-chip {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
}

.stats-chip p {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cbd5f5;
  margin-bottom: 0.4rem;
}

.stats-chip span {
  font-size: 1.4rem;
  font-weight: 600;
}

.stats-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 45px rgba(2, 6, 23, 0.35);
  padding: 1.5rem;
  color: #f8fafc;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
}
</style>
