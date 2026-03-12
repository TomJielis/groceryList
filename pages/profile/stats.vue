<script setup lang="ts">
import { useUserStats } from '~/composables/useUserStats'
import { useI18nStore } from '~/stores/i18n'
import MonthSelector from '~/components/profile/MonthSelector.vue'
import ProfileItemsActivity from '~/components/profile/ProfileItemsActivity.vue'
import ProfileTopItems from '~/components/profile/ProfileTopItems.vue'
import Card from 'primevue/card'

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
    error.value = e.message || i18n.t('errors.failedToLoadStats')
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
    error.value = e.message || i18n.t('errors.failedToLoadStats')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="stats-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <!-- Header -->
      <div class="py-4 flex items-center gap-3">
        <NuxtLink
          to="/profile"
          class="w-8 h-8 flex items-center justify-center transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </NuxtLink>
        <div>
          <p class="page-eyebrow">
            {{ i18n.t('profile.myStats') }}
          </p>
          <h1 class="page-heading">
            {{ i18n.t('profile.myStatsDescription') }}
          </h1>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Initial Loading State -->
        <div v-if="initialLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded h-10 w-10 border-b-2 mx-auto"></div>
            <p class="mt-4 text-sm">{{ i18n.t('common.loading') }}</p>
          </div>
        </div>

        <!-- Error State (only for initial load) -->
        <div v-else-if="error && !data" class="text-center py-20">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Month Selector (always visible) -->
          <div class="w-full">
            <MonthSelector
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- Error message for month change -->
          <div v-if="error && data" class="border border-red-800 bg-red-900/40 rounded p-4">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Loading indicator for month change -->
          <div v-if="loading" class="flex items-center justify-center py-10">
            <div class="animate-spin rounded h-8 w-8 border-b-2"></div>
          </div>

          <template v-else-if="data">
            <!-- Items Activity Section -->
            <div class="pt-5">
              <p class="page-eyebrow mb-1">
                {{ i18n.t('profile.itemsActivity') }}
              </p>
              <h2 class="text-[1.1rem] font-medium mb-4">
                {{ i18n.t('profile.itemsActivity') }}
              </h2>
              <ProfileItemsActivity :items="data.items" :invalid_login_attempts="data.invalid_login_attempts" />
            </div>

            <!-- Top Items Section -->
            <div v-if="data.top_items" class="pt-5">
              <p class="page-eyebrow mb-1">
                {{ i18n.t('profile.topItems') }}
              </p>
              <h2 class="text-[1.1rem] font-medium mb-4">
                {{ i18n.t('profile.topItems') }}
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
  font-family: 'DM Sans', system-ui, sans-serif;
  background: transparent;
}
</style>
