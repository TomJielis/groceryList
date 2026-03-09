<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import DataTable from '~/components/DataTable.vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const i18n = useI18nStore()
const { getUsers } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const users = ref<any[]>([])
const total = ref(0)

onMounted(async () => {
  try {
    const data = await getUsers()
    users.value = data.users || []
    total.value = data.total || 0
    // Sort users by last_active (most recent first)
    users.value = (data.users || []).sort((a: any, b: any) => {
      if (!a.last_active) return 1
      if (!b.last_active) return -1
      return new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
    })
  } catch (e: any) {
    error.value = e.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
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
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <!-- Back Button -->
          <NuxtLink
            to="/admin"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>

          <!-- Title -->
          <div class="flex-1 min-w-0">
            <h1 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {{ i18n.t('admin.users') }}
            </h1>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ total }} {{ i18n.t('admin.totalUsers') || 'gebruikers' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden pb-24">
      <div class="max-w-7xl mx-auto px-4 py-6">
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

        <!-- Users Table -->
        <DataTable
          v-else
          :columns="userColumns"
          :data="users"
          :empty-message="i18n.t('admin.noUsers')"
          :row-link="(row) => `/admin/users/${row.id}`"
        />
      </div>
    </div>
  </div>
</template>
