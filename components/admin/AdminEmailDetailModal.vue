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

const iframeRef = ref<HTMLIFrameElement | null>(null)

watch(
    () => [props.email, props.visible] as const,
    ([email, visible]) => {
        if (!visible || !email?.body_html) return
        nextTick(() => {
            const doc = iframeRef.value?.contentDocument
            if (doc) {
                doc.open()
                doc.write(email.body_html!)
                doc.close()
            }
        })
    }
)
</script>

<template>
    <Dialog
        :visible="visible"
        @update:visible="close"
        modal
        :header="email?.subject ?? 'Email'"
        :style="{ width: '800px', maxWidth: '95vw' }"
        :dismissable-mask="true"
    >
        <div v-if="email" class="flex flex-col gap-4">
            <!-- Metadata grid -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm border-b border-surface-200 pb-4">
                <div>
                    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium">Type</p>
                    <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-surface-100 text-surface-700">
                        {{ email.type }}
                    </span>
                </div>
                <div>
                    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium">Status</p>
                    <span
                        class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                        :class="email.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    >
                        {{ email.status }}
                    </span>
                </div>
                <div>
                    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium">Recipient</p>
                    <p class="mt-1 text-surface-700">
                        {{ email.recipient_name ? `${email.recipient_name} <${email.recipient_email}>` : email.recipient_email }}
                    </p>
                </div>
                <div>
                    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium">Sent at</p>
                    <p class="mt-1 text-surface-700">
                        {{ email.sent_at ? new Date(email.sent_at).toLocaleString() : '—' }}
                    </p>
                </div>
                <div v-if="email.triggered_by">
                    <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium">Triggered by</p>
                    <NuxtLink
                        :to="`/admin/users/${email.triggered_by.id}`"
                        class="mt-1 inline-block underline-offset-2 hover:underline"
                        @click="close"
                    >
                        {{ email.triggered_by.name }}
                    </NuxtLink>
                </div>
            </div>

            <!-- Error -->
            <div
                v-if="email.status === 'failed' && email.error_message"
                class="rounded bg-red-50 border border-red-200 p-3 text-sm text-red-700"
            >
                <p class="font-medium mb-1">Error</p>
                <p>{{ email.error_message }}</p>
            </div>

            <!-- HTML body in sandboxed iframe -->
            <div v-if="email.body_html">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium mb-2">HTML Body</p>
                <iframe
                    ref="iframeRef"
                    sandbox=""
                    class="w-full rounded border border-surface-200"
                    style="height: 420px;"
                />
            </div>

            <!-- Plain text fallback -->
            <div v-else-if="email.body_text">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] text-surface-500 font-medium mb-2">Text Body</p>
                <pre class="rounded bg-surface-50 border border-surface-200 p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono">{{ email.body_text }}</pre>
            </div>

            <p v-else class="text-sm text-surface-400 italic">No body content available.</p>
        </div>
    </Dialog>
</template>
