<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const route = useRoute()
const i18n = useI18nStore()
const { getUserDetail } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>(null)

const userId = computed(() => Number(route.params.id))

onMounted(async () => {
  try {
    data.value = await getUserDetail(userId.value)
  } catch (e: any) {
    error.value = e.message || 'Failed to load user details'
  } finally {
    loading.value = false
  }
})

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
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <NuxtLink
          to="/admin/users"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1 mb-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          {{ i18n.t('admin.backToUsers') }}
        </NuxtLink>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="text-2xl">👤</span>
          <span>{{ data?.user?.name || i18n.t('admin.userDetail') }}</span>
        </h1>
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

        <!-- Content -->
        <template v-else-if="data">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- User Info -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.userInfo') }}
              </h2>
              <dl class="divide-y divide-slate-200 dark:divide-slate-700">
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.email') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.user.email }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.registered') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ formatDate(data.user.created_at) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.emailVerified') }}</dt>
                  <dd class="text-slate-900 dark:text-white">
                    {{ data.user.email_verified_at ? formatDate(data.user.email_verified_at, true) : i18n.t('admin.no') }}
                  </dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.lastActive') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ formatDate(data.user.last_active, true) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.appVersion') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ data.user.terms_version || '-' }}</dd>
                </div>
              </dl>
            </div>

            <!-- Lists Info -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {{ i18n.t('admin.listsInfo') }}
              </h2>
              <dl class="divide-y divide-slate-200 dark:divide-slate-700">
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.ownedLists') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.lists.owned }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-slate-500 dark:text-slate-400">{{ i18n.t('admin.sharedWithUser') }}</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ data.lists.shared_with_user }}</dd>
                </div>
                <div class="py-3 flex justify-between font-semibold">
                  <dt class="text-slate-700 dark:text-slate-300">{{ i18n.t('admin.totalAccess') }}</dt>
                  <dd class="text-slate-900 dark:text-white">{{ data.lists.total_access }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Items Activity -->
          <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('admin.itemsActivity') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminStatsCard
                :title="i18n.t('admin.itemsAddedMonth')"
                :value="data.items?.current_month?.added ?? 0"
                :change="data.items?.change"
                :previous-value="data.items?.previous_month?.added"
              />
              <AdminStatsCard
                :title="i18n.t('admin.itemsCheckedMonth')"
                :value="data.items?.current_month?.checked ?? 0"
                :previous-value="data.items?.previous_month?.checked"
              />
              <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {{ i18n.t('admin.previousMonth') }} ({{ data.items?.previous_month?.period }})
                </h3>
                <p class="mt-2 text-lg text-slate-700 dark:text-slate-300">
                  {{ data.items?.previous_month?.added ?? 0 }} {{ i18n.t('admin.added') }},
                  {{ data.items?.previous_month?.checked ?? 0 }} {{ i18n.t('admin.checked') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Top Items -->
          <div v-if="data.top_items" class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {{ i18n.t('admin.userTopItems') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Most Added -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {{ i18n.t('admin.mostAdded') }}
                </h3>
                <ul v-if="data.top_items.current_month?.most_added?.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in data.top_items.current_month.most_added.slice(0, 5)"
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
                  {{ i18n.t('admin.noTopItems') }}
                </p>
              </div>

              <!-- Most Checked -->
              <div>
                <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {{ i18n.t('admin.mostChecked') }}
                </h3>
                <ul v-if="data.top_items.current_month?.most_checked?.length > 0" class="space-y-2">
                  <li
                    v-for="(item, index) in data.top_items.current_month.most_checked.slice(0, 5)"
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
                  {{ i18n.t('admin.noTopItems') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
