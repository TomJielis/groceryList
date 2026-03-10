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
  { key: 'lists_count', label: i18n.t('admin.lists'), type: 'number' as const },
  { key: 'terms_version', label: i18n.t('admin.version'), hideOnMobile: true },
]
</script>

<template>
  <div class="admin-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
      <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 md:p-8 shadow-2xl space-y-4">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/admin"
            class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div>
            <p class="text-[11px] uppercase tracking-[0.4em] text-slate-300">
              {{ i18n.t('admin.overview') }}
            </p>
            <h1 class="text-3xl font-bold">
              {{ i18n.t('admin.users') }}
            </h1>
            <p class="text-sm text-slate-300">
              {{ total }} {{ i18n.t('admin.totalUsers') }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.activeUsers') }}
            </p>
            <p class="text-2xl font-semibold">
              {{ users.filter(user => user.last_active).length }}
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.verifiedEmails') }}
            </p>
            <p class="text-2xl font-semibold text-emerald-300">
              {{ users.filter(user => user.email_verified).length }}
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.blocked') }}
            </p>
            <p class="text-2xl font-semibold text-rose-300">
              {{ users.filter(user => user.blocked).length }}
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('admin.lists') }}
            </p>
            <p class="text-2xl font-semibold text-amber-300">
              {{ users.reduce((sum, user) => sum + (user.lists_count || 0), 0) }}
            </p>
          </div>
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
