<script setup lang="ts">
import { useAdminApi } from '~/composables/useAdminApi'
import DataTable from '~/components/DataTable.vue'
import AdminEmailDetailModal from '~/components/admin/AdminEmailDetailModal.vue'

definePageMeta({
    middleware: ['auth', 'admin'],
})
const { getEmails } = useAdminApi()

const loading = ref(true)
const error = ref<string | null>(null)
const emails = ref<any[]>([])
const total = ref(0)

const filterStatus = ref('')
const filterType = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')

const selectedEmail = ref<any | null>(null)
const modalVisible = ref(false)

const typeOptions = [
    { label: 'All types', value: '' },
    { label: 'Welcome', value: 'welcome' },
    { label: 'Reset password', value: 'reset_password' },
    { label: 'Grocery list invite', value: 'grocery_list_invite' },
]

const statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Sent', value: 'sent' },
    { label: 'Failed', value: 'failed' },
]

const loadEmails = async () => {
    loading.value = true
    error.value = null
    try {
        const data = await getEmails({
            status: filterStatus.value || undefined,
            type: filterType.value || undefined,
            date_from: filterDateFrom.value || undefined,
            date_to: filterDateTo.value || undefined,
        })
        emails.value = data.data || []
        total.value = data.meta?.total ?? emails.value.length
    } catch (e: any) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

onMounted(loadEmails)

const onFilterChange = () => loadEmails()

const openDetail = (row: any) => {
    selectedEmail.value = row
    modalVisible.value = true
}

const emailColumns = [
    {
        key: 'type',
        label: 'Type',
        isPrimary: true,
        badges: (row: any) => [{ text: row.type, color: 'blue' as const }],
    },
    { key: 'recipient_email', label: 'Recipient' },
    { key: 'subject', label: 'Subject', hideOnMobile: true },
    {
        key: 'status',
        label: 'Status',
        badges: (row: any) => [
            { text: row.status, color: row.status === 'sent' ? 'green' as const : 'red' as const },
        ],
    },
    { key: 'sent_at', label: 'Sent at', type: 'datetime' as const, hideOnMobile: true },
    {
        key: 'triggered_by',
        label: 'Triggered by',
        hideOnMobile: true,
        format: (value: any) => value?.name ?? '—',
    },
]
</script>

<template>
    <div class="px-4 py-6">
        <div class="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-16">
            <PageHeader
                back-to="/admin"
                title="Emails"
                :subtitle="`${total} emails`"
            />

            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
                <select
                    v-model="filterType"
                    @change="onFilterChange"
                    class="text-sm border border-surface-200 rounded px-3 py-1.5 bg-white"
                >
                    <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
                <select
                    v-model="filterStatus"
                    @change="onFilterChange"
                    class="text-sm border border-surface-200 rounded px-3 py-1.5 bg-white"
                >
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
                <input
                    v-model="filterDateFrom"
                    type="date"
                    @change="onFilterChange"
                    class="text-sm border border-surface-200 rounded px-3 py-1.5"
                />
                <input
                    v-model="filterDateTo"
                    type="date"
                    @change="onFilterChange"
                    class="text-sm border border-surface-200 rounded px-3 py-1.5"
                />
            </div>

            <div v-if="loading" class="text-sm text-surface-400">Loading...</div>
            <div v-else-if="error" class="text-sm text-red-500">{{ error }}</div>
            <DataTable
                v-else
                :columns="emailColumns"
                :data="emails"
                :row-click-handler="openDetail"
                empty-message="No emails found."
            />
        </div>
    </div>

    <AdminEmailDetailModal
        :email="selectedEmail"
        v-model:visible="modalVisible"
    />
</template>
