# User Stats Profile - Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Voeg statistieken pagina toe aan profiel met items activity, top items, en admin link.

**Architecture:** Nieuwe stats pagina met herbruikbare componenten. MonthSelector component wordt gedeeld tussen profile/stats en admin user detail. Data via nieuwe `/api/user/stats` endpoint (backend plan apart).

**Tech Stack:** Vue 3, Nuxt 3, TypeScript, Tailwind CSS

---

## Task 1: MonthSelector Component

**Files:**
- Create: `components/profile/MonthSelector.vue`

**Step 1: Create MonthSelector component**

```vue
<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface Props {
  selectedMonth: string
  availableMonths: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [month: string]
}>()

const i18n = useI18nStore()

const currentIndex = computed(() => props.availableMonths.indexOf(props.selectedMonth))
const canGoNewer = computed(() => currentIndex.value > 0)
const canGoOlder = computed(() => currentIndex.value < props.availableMonths.length - 1)

const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-')
  const date = new Date(parseInt(year), parseInt(monthNum) - 1)
  return date.toLocaleDateString(i18n.locale === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const goNewer = () => {
  if (canGoNewer.value) {
    emit('change', props.availableMonths[currentIndex.value - 1])
  }
}

const goOlder = () => {
  if (canGoOlder.value) {
    emit('change', props.availableMonths[currentIndex.value + 1])
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-4">
    <button
      @click="goOlder"
      :disabled="!canGoOlder"
      class="p-2 rounded-lg transition-colors"
      :class="canGoOlder
        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <span class="text-lg font-medium text-slate-900 dark:text-white min-w-[160px] text-center">
      {{ formatMonth(selectedMonth) }}
    </span>

    <button
      @click="goNewer"
      :disabled="!canGoNewer"
      class="p-2 rounded-lg transition-colors"
      :class="canGoNewer
        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</template>
```

---

## Task 2: useUserStats Composable

**Files:**
- Create: `composables/useUserStats.ts`

**Step 1: Create useUserStats composable**

```typescript
export function useUserStats() {
  async function getStats(month?: string) {
    const params = month ? `?month=${month}` : ''
    const response = await fetch(`/api/user/stats${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`)
    }

    return await response.json()
  }

  return { getStats }
}
```

---

## Task 3: ProfileItemsActivity Component

**Files:**
- Create: `components/profile/ProfileItemsActivity.vue`

**Step 1: Create ProfileItemsActivity component**

```vue
<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'

interface Props {
  items: {
    current_month: { added: number, checked: number, period: string }
    previous_month: { added: number, checked: number, period: string }
    change?: { absolute: number, percentage: number | null }
  }
}

defineProps<Props>()
const i18n = useI18nStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <AdminStatsCard
      :title="i18n.t('profile.itemsAddedMonth') || 'Items toegevoegd'"
      :value="items?.current_month?.added ?? 0"
      :change="items?.change"
      :previous-value="items?.previous_month?.added"
    />
    <AdminStatsCard
      :title="i18n.t('profile.itemsCheckedMonth') || 'Items afgevinkt'"
      :value="items?.current_month?.checked ?? 0"
      :previous-value="items?.previous_month?.checked"
    />
    <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">
        {{ i18n.t('profile.previousMonth') || 'Vorige maand' }} ({{ items?.previous_month?.period }})
      </h3>
      <p class="mt-2 text-lg text-slate-700 dark:text-slate-300">
        {{ items?.previous_month?.added ?? 0 }} {{ i18n.t('profile.added') || 'toegevoegd' }},
        {{ items?.previous_month?.checked ?? 0 }} {{ i18n.t('profile.checked') || 'afgevinkt' }}
      </p>
    </div>
  </div>
</template>
```

---

## Task 4: ProfileTopItems Component

**Files:**
- Create: `components/profile/ProfileTopItems.vue`

**Step 1: Create ProfileTopItems component**

```vue
<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'

interface TopItem {
  name: string
  count: number
}

interface Props {
  topItems: {
    current_month?: {
      most_added?: TopItem[]
      most_checked?: TopItem[]
    }
  }
}

defineProps<Props>()
const i18n = useI18nStore()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Most Added -->
    <div>
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
        {{ i18n.t('profile.mostAdded') || 'Meest toegevoegd' }}
      </h3>
      <ul v-if="topItems?.current_month?.most_added?.length" class="space-y-2">
        <li
          v-for="(item, index) in topItems.current_month.most_added.slice(0, 5)"
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
        {{ i18n.t('profile.noTopItems') || 'Geen items deze maand' }}
      </p>
    </div>

    <!-- Most Checked -->
    <div>
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
        {{ i18n.t('profile.mostChecked') || 'Meest afgevinkt' }}
      </h3>
      <ul v-if="topItems?.current_month?.most_checked?.length" class="space-y-2">
        <li
          v-for="(item, index) in topItems.current_month.most_checked.slice(0, 5)"
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
        {{ i18n.t('profile.noTopItems') || 'Geen items deze maand' }}
      </p>
    </div>
  </div>
</template>
```

---

## Task 5: Profile Stats Page

**Files:**
- Create: `pages/profile/stats.vue`

**Step 1: Create profile stats page**

```vue
<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import { useUserStats } from '~/composables/useUserStats'
import MonthSelector from '~/components/profile/MonthSelector.vue'
import ProfileItemsActivity from '~/components/profile/ProfileItemsActivity.vue'
import ProfileTopItems from '~/components/profile/ProfileTopItems.vue'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const i18n = useI18nStore()
const { getStats } = useUserStats()

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>(null)
const selectedMonth = ref('')
const availableMonths = ref<string[]>([])

const loadStats = async (month?: string) => {
  loading.value = true
  error.value = null
  try {
    const result = await getStats(month)
    data.value = result
    if (!selectedMonth.value && result.available_months?.length) {
      selectedMonth.value = result.available_months[0]
      availableMonths.value = result.available_months
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

const onMonthChange = (month: string) => {
  selectedMonth.value = month
  loadStats(month)
}

onMounted(() => loadStats())
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <NuxtLink
          to="/profile"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1 mb-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          {{ i18n.t('profile.backToProfile') || 'Terug naar profiel' }}
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="text-2xl">📊</span>
          <span>{{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}</span>
        </h1>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-24">
      <div class="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <!-- Loading State -->
        <div v-if="loading && !data" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Content -->
        <template v-else-if="data">
          <!-- Month Selector -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <MonthSelector
              v-if="availableMonths.length"
              :selected-month="selectedMonth"
              :available-months="availableMonths"
              @change="onMonthChange"
            />
          </div>

          <!-- Items Activity -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('profile.itemsActivity') || 'Item Activiteit' }}
            </h2>
            <ProfileItemsActivity :items="data.items" />
          </div>

          <!-- Top Items -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('profile.topItems') || 'Top Items' }}
            </h2>
            <ProfileTopItems :top-items="data.top_items" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
```

---

## Task 6: Update Profile Page

**Files:**
- Modify: `pages/profile.vue`

**Step 1: Add stats link and admin section to profile page**

Na de "Pending Lists" sectie, voeg toe:

```vue
<!-- My Stats Link -->
<NuxtLink
  to="/profile/stats"
  class="block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
>
  <div class="px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ i18n.t('profile.myStatsDescription') || 'Bekijk je item activiteit en top items' }}
        </p>
      </div>
    </div>
    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </div>
</NuxtLink>
```

Na de "Account Actions" sectie, voeg admin sectie toe:

```vue
<!-- Admin Section (only for admins) -->
<NuxtLink
  v-if="authStore.user?.is_admin"
  to="/admin"
  class="block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
>
  <div class="px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ i18n.t('profile.adminDashboard') || 'Admin Dashboard' }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ i18n.t('profile.adminDashboardDescription') || 'Beheer gebruikers en bekijk statistieken' }}
        </p>
      </div>
    </div>
    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </div>
</NuxtLink>
```

---

## Task 7: Add MonthSelector to Admin User Detail

**Files:**
- Modify: `pages/admin/users/[id].vue`
- Modify: `composables/useAdminApi.ts`

**Step 1: Update useAdminApi to accept month parameter**

In `composables/useAdminApi.ts`, wijzig `getUserDetail`:

```typescript
async function getUserDetail(id: number, month?: string) {
    const params = month ? `?month=${month}` : '';
    const response = await fetch(`/api/admin/users/${id}${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user detail: ${response.statusText}`);
    }

    return await response.json();
}
```

**Step 2: Add MonthSelector to admin user detail page**

Voeg imports en state toe, en MonthSelector component in de template.

---

## Task 8: Create Nuxt API Route for User Stats

**Files:**
- Create: `server/api/user/stats.ts`

**Step 1: Create stats endpoint (proxy to backend)**

```typescript
import { getCookie, getQuery } from 'h3'
import { apiClient } from '~/server/api/utils/apiClient'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const query = getQuery(event)
  const month = query.month ? `?month=${query.month}` : ''

  try {
    const response = await apiClient(`/user/stats${month}`, {
      method: 'GET',
    }, token)
    return response
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${error}`)
  }
})
```

---

## Backend API Plan (voor andere agent)

Het backend moet een nieuw endpoint implementeren:

**Endpoint:** `GET /user/stats?month=YYYY-MM`

**Response:**
```json
{
  "items": {
    "current_month": { "added": 42, "checked": 38, "period": "februari 2026" },
    "previous_month": { "added": 35, "checked": 30, "period": "januari 2026" },
    "change": { "absolute": 7, "percentage": 20 }
  },
  "top_items": {
    "current_month": {
      "most_added": [{ "name": "Melk", "count": 8 }, ...],
      "most_checked": [{ "name": "Brood", "count": 12 }, ...]
    }
  },
  "available_months": ["2026-02", "2026-01", "2025-12", ...]
}
```

**Bestaande admin endpoint aanpassen:** `GET /admin/users/{id}?month=YYYY-MM` - voeg month parameter toe voor filtering.
