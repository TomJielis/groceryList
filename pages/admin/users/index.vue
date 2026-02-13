<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'

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

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(i18n.locale === 'nl' ? 'nl-NL' : 'en-US')
}
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="text-2xl">👥</span>
            <span>{{ i18n.t('admin.users') }} ({{ total }})</span>
          </h1>
          <NuxtLink
            to="/admin"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            {{ i18n.t('admin.backToDashboard') }}
          </NuxtLink>
        </div>
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

        <!-- Empty State -->
        <div v-else-if="users.length === 0" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center py-12">
          <p class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.noUsers') }}</p>
        </div>

        <!-- Users Table (Desktop) -->
        <div v-if="users.length > 0" class="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead class="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ i18n.t('admin.name') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ i18n.t('admin.email') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ i18n.t('admin.registered') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  {{ i18n.t('admin.lastActive') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ i18n.t('admin.lists') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  {{ i18n.t('admin.version') }}
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-900 dark:text-white">{{ user.name }}</span>
                    <span
                      v-if="user.email_verified"
                      class="text-green-500"
                      :title="i18n.t('admin.verified')"
                    >✓</span>
                    <span
                      v-if="user.blocked"
                      class="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 rounded-full"
                    >{{ i18n.t('admin.blocked') }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm hidden lg:table-cell">
                  {{ formatDate(user.last_active) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm">
                  {{ user.lists_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm hidden lg:table-cell">
                  {{ user.terms_version || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    {{ i18n.t('admin.details') }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Users Cards (Mobile) -->
        <div v-if="users.length > 0" class="md:hidden space-y-3">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4"
          >
            <!-- User Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-900 dark:text-white">{{ user.name }}</span>
                <span
                  v-if="user.email_verified"
                  class="text-green-500 text-sm"
                  :title="i18n.t('admin.verified')"
                >✓</span>
                <span
                  v-if="user.blocked"
                  class="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 rounded-full"
                >{{ i18n.t('admin.blocked') }}</span>
              </div>
              <NuxtLink
                :to="`/admin/users/${user.id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                {{ i18n.t('admin.details') }}
              </NuxtLink>
            </div>

            <!-- Email -->
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-3 break-all">{{ user.email }}</p>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                <p class="text-xs text-slate-400 dark:text-slate-500 uppercase">{{ i18n.t('admin.registered') }}</p>
                <p class="text-slate-700 dark:text-slate-300 font-medium">{{ formatDate(user.created_at) }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                <p class="text-xs text-slate-400 dark:text-slate-500 uppercase">{{ i18n.t('admin.lastActive') }}</p>
                <p class="text-slate-700 dark:text-slate-300 font-medium">{{ formatDate(user.last_active) }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                <p class="text-xs text-slate-400 dark:text-slate-500 uppercase">{{ i18n.t('admin.lists') }}</p>
                <p class="text-slate-700 dark:text-slate-300 font-medium">{{ user.lists_count }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                <p class="text-xs text-slate-400 dark:text-slate-500 uppercase">{{ i18n.t('admin.version') }}</p>
                <p class="text-slate-700 dark:text-slate-300 font-medium">{{ user.terms_version || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
