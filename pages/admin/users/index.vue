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
    error.value = e.message || i18n.t('errors.failedToLoadUsers')
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
  { key: 'lists_count', label: i18n.t('admin.lists'), type: 'number' as const, hideOnMobile: true },
  { key: 'terms_version', label: i18n.t('admin.version'), hideOnMobile: true },
]
</script>

<template>
  <div class="admin-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <!-- Page header -->
      <div class="border-b border-[#27272a] pb-6">
        <div class="flex items-center gap-4 mb-6">
          <NuxtLink
            to="/admin"
            class="w-9 h-9 flex items-center justify-center border border-[#27272a] text-[#71717a] hover:border-[#52525b] hover:text-[#a1a1aa] transition rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div>
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.overview') }}
            </p>
            <h1 class="text-2xl md:text-3xl font-medium text-[#fafafa]">
              {{ i18n.t('admin.users') }}
            </h1>
            <p class="text-sm text-[#71717a]">
              {{ total }} {{ i18n.t('admin.totalUsers') }}
            </p>
          </div>
        </div>
        <!-- Stats row -->
        <div class="grid grid-cols-2 md:grid-cols-4 border-t border-[#27272a]">
          <div class="px-0 pr-4 py-3 border-r border-b md:border-b-0 border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.activeUsers') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ users.filter(user => user.last_active).length }}
            </p>
          </div>
          <div class="px-4 py-3 border-b md:border-b-0 md:border-r border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.verifiedEmails') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ users.filter(user => user.email_verified).length }}
            </p>
          </div>
          <div class="px-0 pr-4 py-3 border-r border-[#27272a]">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.blocked') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ users.filter(user => user.blocked).length }}
            </p>
          </div>
          <div class="px-4 py-3">
            <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] font-medium">
              {{ i18n.t('admin.lists') }}
            </p>
            <p class="text-xl font-light text-[#fafafa]">
              {{ users.reduce((sum, user) => sum + (user.lists_count || 0), 0) }}
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

      <DataTable
        v-else
        :columns="userColumns"
        :data="users"
        :empty-message="i18n.t('admin.noUsers')"
        :row-link="(row) => `/admin/users/${row.id}`"
      />
    </div>
  </div>
</template>
