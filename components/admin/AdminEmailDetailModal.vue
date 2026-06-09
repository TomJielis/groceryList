<script setup lang="ts">
import Dialog from 'primevue/dialog'

interface EmailRecord {
    id: number
    type: string
    recipient_email: string
    recipient_name: string | null
    subject: string | null
    body_html: string | null
    body_text: string | null
    status: 'sent' | 'failed'
    error_message: string | null
    triggered_by: { id: number; name: string; email: string } | null
    sent_at: string | null
}

interface Props {
    email: EmailRecord | null
    visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:visible': [value: boolean]
}>()

const close = () => emit('update:visible', false)

const emailSrcdoc = computed(() =>
    props.email?.body_html ? '<base target="_blank">' + props.email.body_html : ''
)

const recipientLabel = computed(() => {
    if (!props.email) return ''
    return props.email.recipient_name
        ? `${props.email.recipient_name} <${props.email.recipient_email}>`
        : props.email.recipient_email
})

const formattedDate = computed(() => {
    if (!props.email?.sent_at) return null
    return new Date(props.email.sent_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
})
</script>

<template>
    <Dialog
        :visible="visible"
        @update:visible="close"
        modal
        :header="email?.subject ?? 'Email'"
        :style="{ width: '900px', maxWidth: '96vw' }"
        :dismissable-mask="true"
        :pt="{ content: { style: 'padding: 0; overflow: hidden;' } }"
    >
        <div v-if="email">
            <!-- Meta bar -->
            <div class="flex items-center gap-2 px-5 py-3 border-b border-surface-100 bg-surface-50 text-sm flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-surface-200 text-surface-600">
                    {{ email.type.replaceAll('_', ' ') }}
                </span>
                <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                    :class="email.status === 'sent'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'"
                >{{ email.status }}</span>
                <span class="w-px h-3.5 bg-surface-200 mx-0.5" />
                <span class="text-surface-700 text-xs truncate max-w-[260px]">{{ recipientLabel }}</span>
                <template v-if="formattedDate">
                    <span class="text-surface-300 text-xs">·</span>
                    <span class="text-surface-400 text-xs">{{ formattedDate }}</span>
                </template>
                <template v-if="email.triggered_by">
                    <span class="text-surface-300 text-xs">·</span>
                    <NuxtLink
                        :to="`/admin/users/${email.triggered_by.id}`"
                        class="text-surface-400 text-xs hover:text-surface-700 transition-colors"
                        @click="close"
                    >by {{ email.triggered_by.name }}</NuxtLink>
                </template>
            </div>

            <!-- Send error -->
            <div
                v-if="email.status === 'failed' && email.error_message"
                class="flex items-start gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-700"
            >
                <span class="font-semibold shrink-0">Send failed:</span>
                <span>{{ email.error_message }}</span>
            </div>

            <!-- HTML body — edge to edge -->
            <iframe
                v-if="email.body_html"
                :srcdoc="emailSrcdoc"
                sandbox="allow-same-origin allow-popups"
                style="display: block; width: 100%; height: 540px; border: none;"
            />

            <!-- Plain text fallback -->
            <pre
                v-else-if="email.body_text"
                class="m-5 rounded-lg bg-surface-50 border border-surface-200 p-4 text-sm overflow-auto max-h-[480px] whitespace-pre-wrap font-mono text-surface-700"
            >{{ email.body_text }}</pre>

            <p v-else class="px-5 py-10 text-sm text-surface-400 italic text-center">No body content recorded.</p>
        </div>
    </Dialog>
</template>
