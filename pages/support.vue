<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed } from 'vue';
import Card from 'primevue/card'
import Button from 'primevue/button'

const { appName, supportEmail } = useRuntimeConfig().public

const i18n = useI18nStore();
const t = computed(() => i18n.t);

// Help & contact: the App Store's support URL points here, so it must show how to reach us
useHead(() => ({
  title: `${t.value('support.title')} – ${appName}`,
  meta: [{ name: 'description', content: t.value('support.subtitle') }],
}))

const questions = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-10">
      <div class="space-y-1 py-4 border-b border-surface-200">
        <h1 class="page-heading">{{ t('support.title') }}</h1>
        <p class="text-sm text-surface-500">{{ t('support.subtitle') }}</p>
      </div>

      <Card>
        <template #content>
          <h2 class="text-lg font-medium mb-2">{{ t('support.contactTitle') }}</h2>
          <p class="text-sm text-color-secondary leading-relaxed mb-4">{{ t('support.contactText') }}</p>
          <div class="flex flex-wrap items-center gap-4">
            <a :href="`mailto:${supportEmail}?subject=${encodeURIComponent(appName)}`">
              <Button :label="t('support.emailButton')" icon="pi pi-envelope" />
            </a>
            <a class="text-sm underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>
          </div>
        </template>
      </Card>

      <div>
        <h2 class="text-[1.4rem] font-light tracking-tight mb-4">{{ t('support.faqTitle') }}</h2>
        <div class="flex flex-col gap-3">
          <Card v-for="n in questions" :key="n">
            <template #content>
              <p class="text-sm font-medium mb-1">{{ t(`support.q${n}`) }}</p>
              <p class="text-sm text-color-secondary leading-relaxed">{{ t(`support.a${n}`) }}</p>
            </template>
          </Card>
        </div>
      </div>

      <NuxtLink to="/terms" class="text-sm underline">{{ t('support.termsLink') }}</NuxtLink>
    </div>
  </div>
</template>
