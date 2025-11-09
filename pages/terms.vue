<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import BackButton from "~/components/form/backButton.vue";
const i18n = useI18nStore();
const today = new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary-dark dark:text-accent-light mb-2">{{ i18n.t('terms.title') }}</h1>
      <div class="text-sm text-slate-500 mb-4">{{ i18n.t('terms.lastUpdated').replace('{date}', today) }}</div>
      <h2 class="text-lg font-semibold text-accent mt-4 mb-1">{{ i18n.t('terms.about') }}</h2>
      <p>{{ i18n.t('terms.aboutText') }}</p>
      <h2 class="text-lg font-semibold text-accent mt-4 mb-1">{{ i18n.t('terms.admin') }}</h2>
      <p>{{ i18n.t('terms.adminText') }}</p>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <h2 class="text-lg font-semibold text-accent mt-4 mb-1">{{ i18n.t('terms.privacy') }}</h2>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.dataCollected') }}</h3>
      <p>{{ i18n.t('terms.dataCollectedText') }}</p>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.dataCollectedList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <p>{{ i18n.t('terms.dataCollectedExtra') }}</p>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.dataCollectedExtraList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.purpose') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.purposeList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.security') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.securityList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.photos') }}</h3>
      <p>{{ i18n.t('terms.photosText') }}</p>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.photosList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <p>{{ i18n.t('terms.photosNote') }}</p>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.sharing') }}</h3>
      <p>{{ i18n.t('terms.sharingText') }}</p>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.retention') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.retentionList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.cookies') }}</h3>
      <p>{{ i18n.t('terms.cookiesText') }}</p>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.rights') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.rightsList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.changes') }}</h3>
      <p>{{ i18n.t('terms.changesText') }}</p>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
      <h2 class="text-lg font-semibold text-accent mt-4 mb-1">{{ i18n.t('terms.usage') }}</h2>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.usageTitle') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.usageList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.acceptance') }}</h3>
      <ul class="list-disc ml-6 mb-2">
        <li v-for="item in i18n.t('terms.acceptanceList')" :key="item">
          {{ item }}<span v-if="item.includes('*')" class="text-accent">*</span>
        </li>
      </ul>
      <h3 class="font-semibold mt-2">{{ i18n.t('terms.law') }}</h3>
      <p>{{ i18n.t('terms.lawText') }}</p>
    </div>
  </div>
  <backButton
    :label="(i18n.t('common.back'))"
    @click="$router.back()"
  />
</template>

<style scoped>
h1, h2, h3 {
  color: var(--color-accent, #6366f1);
}
</style>