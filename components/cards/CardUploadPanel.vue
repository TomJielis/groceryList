<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'
import { useNotification } from '~/composables/useNotification'
import { useCards } from '~/composables/useCards'

const props = withDefaults(defineProps<{
  visible: boolean
  inline?: boolean
}>(), {
  inline: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'uploaded'): void
}>()

const i18n = useI18nStore()
const { showNotification, showSuccess } = useNotification()
const { storeCard, getCards } = useCards()

const formData = ref({
  title: '',
  attachment: null as File | null
})

const uploading = ref(false)

function resetForm() {
  formData.value = {
    title: '',
    attachment: null
  }
  uploading.value = false
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      resetForm()
    }
  }
)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.value.attachment = target.files[0]
  } else {
    formData.value.attachment = null
  }
}

async function handleSubmit() {
  if (!formData.value.title || !formData.value.attachment || uploading.value) return
  uploading.value = true

  const reader = new FileReader()

  reader.onload = async () => {
    try {
      const base64 = reader.result as string
      await storeCard({
        title: formData.value.title,
        attachment: base64
      })
      await getCards()
      showSuccess(i18n.t('cards.uploadSuccess'))
      emit('uploaded')
      emit('close')
      resetForm()
    } catch (error) {
      showNotification(i18n.t('errors.cardStoreFailed'))
    } finally {
      uploading.value = false
    }
  }

  reader.onerror = () => {
    showNotification(i18n.t('errors.cardStoreFailed'))
    uploading.value = false
  }

  reader.readAsDataURL(formData.value.attachment)
}
</script>

<template>
  <!-- Inline mode -->
  <template v-if="inline">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="visible" class="upload-form">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <!-- Title -->
          <div>
            <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5" style="color: var(--p-surface-500)">
              {{ i18n.t('cards.title') }}
            </label>
            <input
              v-model="formData.title"
              type="text"
              :placeholder="i18n.t('cards.titlePlaceholder')"
              required
              class="w-full px-0 py-2 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition text-base font-medium placeholder:text-surface-400"
            />
          </div>

          <!-- File -->
          <div>
            <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5" style="color: var(--p-surface-500)">
              {{ i18n.t('cards.attachment') }}
            </label>
            <input
              @change="handleFileChange"
              type="file"
              id="inline-attachment"
              accept="image/*,application/pdf"
              required
              class="block w-full text-sm text-color-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border file:border-surface-200
                file:text-sm file:font-medium
                file:bg-transparent file:text-color-secondary
                hover:file:border-surface-400
                file:cursor-pointer file:transition-all
                border border-dashed border-surface-200
                rounded p-3
                hover:border-surface-400"
            />
            <p class="mt-2 text-xs text-color-secondary">{{ i18n.t('cards.fileTypes') }}</p>

            <div v-if="formData.attachment" class="mt-3 flex items-center gap-2 text-sm text-color-secondary">
              <svg class="w-4 h-4 text-color-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ formData.attachment.name }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-2 pt-2">
            <Button
              type="button"
              severity="secondary"
              :label="i18n.t('common.cancel')"
              class="flex-1"
              @click="emit('close')"
            />
            <Button
              type="submit"
              severity="primary"
              :label="uploading ? i18n.t('common.loading') : i18n.t('cards.uploadBtn')"
              :disabled="!formData.title || !formData.attachment || uploading"
              class="flex-1"
            />
          </div>
        </form>
      </div>
    </transition>
  </template>

  <!-- Modal (teleport) mode -->
  <Teleport v-else to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click.self="emit('close')"
      >
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-6"
        >
          <div
            v-if="visible"
            class="w-full sm:max-w-lg bg-surface-900 border border-surface-200 rounded-t sm:rounded overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-surface-200">
              <div>
                <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-0.5" style="color: var(--p-surface-500)">grocery list</p>
                <h2 class="text-[1.1rem] font-medium">{{ i18n.t('cards.subtitle') }}</h2>
              </div>
              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center text-color-secondary hover:text-color transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 flex flex-col gap-6">
              <!-- Title -->
              <div>
                <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5" style="color: var(--p-surface-500)">
                  {{ i18n.t('cards.title') }}
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  :placeholder="i18n.t('cards.titlePlaceholder')"
                  required
                  class="w-full px-0 py-2 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition text-base font-medium placeholder:text-surface-400"
                />
              </div>

              <!-- File -->
              <div>
                <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5" style="color: var(--p-surface-500)">
                  {{ i18n.t('cards.attachment') }}
                </label>
                <input
                  @change="handleFileChange"
                  type="file"
                  id="attachment"
                  accept="image/*,application/pdf"
                  required
                  class="block w-full text-sm text-color-secondary
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border file:border-surface-200
                    file:text-sm file:font-medium
                    file:bg-transparent file:text-color-secondary
                    hover:file:border-surface-400
                    file:cursor-pointer file:transition-all
                    border border-dashed border-surface-200
                    rounded p-3
                    hover:border-surface-400"
                />
                <p class="mt-2 text-xs text-color-secondary">{{ i18n.t('cards.fileTypes') }}</p>

                <div v-if="formData.attachment" class="mt-3 flex items-center gap-2 text-sm text-color-secondary">
                  <svg class="w-4 h-4 text-color-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formData.attachment.name }}</span>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-2 pt-2">
                <Button
                  type="button"
                  severity="secondary"
                  :label="i18n.t('common.cancel')"
                  class="flex-1"
                  @click="emit('close')"
                />
                <Button
                  type="submit"
                  severity="primary"
                  :label="uploading ? i18n.t('common.loading') : i18n.t('cards.uploadBtn')"
                  :disabled="!formData.title || !formData.attachment || uploading"
                  class="flex-1"
                />
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>
