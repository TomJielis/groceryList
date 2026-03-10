<script setup lang="ts">
import { ref, watch } from 'vue'
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
  <template v-if="inline">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="visible"
        class="w-full bg-slate-900/80 border border-white/10 rounded-3xl shadow-2xl text-white overflow-hidden mb-6"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p class="text-xs uppercase tracking-[0.4em] text-slate-400">
              {{ i18n.t('cards.upload') }}
            </p>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('cards.subtitle') }}
            </h2>
          </div>
          <button
            type="button"
            class="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              {{ i18n.t('cards.title') }}
            </label>
            <input
              v-model="formData.title"
              type="text"
              :placeholder="i18n.t('cards.titlePlaceholder')"
              required
              class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl focus:ring-2 focus:ring-emerald-300/60 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              {{ i18n.t('cards.attachment') }}
            </label>
            <div class="relative">
              <input
                @change="handleFileChange"
                type="file"
                id="inline-attachment"
                accept="image/*,application/pdf"
                required
                class="block w-full text-sm text-slate-300
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gradient-to-r file:from-emerald-400 file:to-emerald-500
                  file:text-slate-900
                  hover:file:from-emerald-300 hover:file:to-emerald-400
                  file:cursor-pointer file:transition-all
                  border-2 border-dashed border-white/15
                  rounded-2xl p-4
                  hover:border-emerald-300/60
                  bg-white/5 backdrop-blur"
              />
            </div>
            <p class="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ i18n.t('cards.fileTypes') }}</span>
            </p>

            <div
              v-if="formData.attachment"
              class="mt-3 p-3 bg-emerald-400/10 rounded-xl border border-emerald-400/20 flex items-center gap-2 text-sm"
            >
              <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ formData.attachment.name }}</span>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="button"
              class="flex-1 px-4 py-3 rounded-2xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
              @click="emit('close')"
            >
              {{ i18n.t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold hover:from-emerald-300 hover:to-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!formData.title || !formData.attachment || uploading"
            >
              {{ uploading ? (i18n.t('common.loading')) : (i18n.t('cards.uploadBtn')) }}
            </button>
          </div>
        </form>
      </div>
    </transition>
  </template>
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
        class="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
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
            class="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl text-white overflow-hidden"
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-slate-400">
                  {{ i18n.t('cards.upload') }}
                </p>
                <h2 class="text-2xl font-semibold">
                  {{ i18n.t('cards.subtitle') }}
                </h2>
              </div>
              <button
                type="button"
                class="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition"
                @click="emit('close')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  {{ i18n.t('cards.title') }}
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  :placeholder="i18n.t('cards.titlePlaceholder')"
                  required
                  class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl focus:ring-2 focus:ring-emerald-300/60 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">
                  {{ i18n.t('cards.attachment') }}
                </label>
                <div class="relative">
                  <input
                    @change="handleFileChange"
                    type="file"
                    id="attachment"
                    accept="image/*,application/pdf"
                    required
                    class="block w-full text-sm text-slate-300
                      file:mr-4 file:py-3 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-emerald-400 file:to-emerald-500
                      file:text-slate-900
                      hover:file:from-emerald-300 hover:file:to-emerald-400
                      file:cursor-pointer file:transition-all
                      border-2 border-dashed border-white/15
                      rounded-2xl p-4
                      hover:border-emerald-300/60
                      bg-white/5 backdrop-blur"
                  />
                </div>
                <p class="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ i18n.t('cards.fileTypes') }}</span>
                </p>

                <div
                  v-if="formData.attachment"
                  class="mt-3 p-3 bg-emerald-400/10 rounded-xl border border-emerald-400/20 flex items-center gap-2 text-sm"
                >
                  <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formData.attachment.name }}</span>
                </div>
              </div>

              <div class="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  type="button"
                  class="flex-1 px-4 py-3 rounded-2xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
                  @click="emit('close')"
                >
                  {{ i18n.t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold hover:from-emerald-300 hover:to-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!formData.title || !formData.attachment || uploading"
                >
                  {{ uploading ? i18n.t('common.loading') : i18n.t('cards.uploadBtn') }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>
