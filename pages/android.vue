<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'
import { useIosDownload } from '~/composables/useIosDownload'

// The Android app as a download (outside the Play Store), with how to install it. Open to everyone: someone without an
// account installs the app first and registers in it.
const config = useRuntimeConfig().public
const i18n = useI18nStore()
const ios = useIosDownload()

type ApkInfo = { available: boolean; size: number | null; updated_at: string | null }
const { data, pending } = await useFetch<{ data: ApkInfo }>('/api/android/info')
const apk = computed(() => data.value?.data ?? null)

// "63 MB · 7 november 2026"
const details = computed(() => {
  if (!apk.value?.available || !apk.value.size || !apk.value.updated_at) return ''
  const size = `${Math.round(apk.value.size / 1_000_000)} MB`
  const date = new Date(apk.value.updated_at).toLocaleDateString(i18n.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return `${size} · ${date}`
})

const steps = ['android.step1', 'android.step2', 'android.step3', 'android.step4']

useHead({ title: `${config.appName} — ${i18n.t('android.title')}` })
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <div class="py-4 border-b border-surface-200 space-y-1">
        <h1 class="page-heading">{{ i18n.t('android.title') }}</h1>
        <p class="text-sm text-surface-500">{{ i18n.t('android.subtitle') }}</p>
      </div>

      <div v-if="pending" class="text-sm text-surface-500">{{ i18n.t('common.loading') }}</div>

      <template v-else-if="apk?.available">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <!-- A plain link: the browser downloads the file itself, so the phone offers to install it -->
          <a href="/downloads/shoplisto.apk" download="Shoplisto.apk" data-testid="android-download">
            <Button icon="pi pi-android" :label="i18n.t('android.download')" severity="primary" />
          </a>
          <span class="text-sm text-surface-500">{{ details }}</span>
        </div>

        <div>
          <h2 class="font-semibold mb-3">{{ i18n.t('android.howTitle') }}</h2>
          <ol class="flex flex-col gap-3">
            <li v-for="(step, index) in steps" :key="step" class="flex gap-3 text-sm leading-relaxed">
              <span class="font-semibold text-surface-400 w-5 flex-shrink-0">{{ index + 1 }}.</span>
              <span>{{ i18n.t(step) }}</span>
            </li>
          </ol>
        </div>

        <div class="flex flex-col gap-2 text-sm text-surface-500 leading-relaxed">
          <p>{{ i18n.t('android.warning') }}</p>
          <p>{{ i18n.t('android.updates') }}</p>
        </div>
      </template>

      <p v-else class="text-sm text-surface-500" data-testid="android-unavailable">{{ i18n.t('android.unavailable') }}</p>

      <p class="text-sm text-surface-500 border-t border-surface-200 pt-6">
        {{ i18n.t('android.iphone') }}
        <a v-if="ios.url" :href="ios.url" class="underline">{{ ios.label.value }}</a>
      </p>
    </div>
  </div>
</template>
