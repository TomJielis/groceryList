<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import BackButton from "~/components/form/backButton.vue";
const config = useRuntimeConfig()

const i18n = useI18nStore();
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary-dark dark:text-accent-light mb-2">{{ i18n.t('terms.title') }}</h1>
      <div class="text-sm text-slate-500 mb-4">{{ i18n.t('terms.lastUpdated').replace('{date}', config.public.lastUpdatedTerms) }}</div>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">{{ i18n.t('terms.aboutTitle') }}</h2>
        <p>{{ i18n.t('terms.aboutText') }}</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">{{ i18n.t('terms.adminTitle') }}</h2>
        <p>{{ i18n.t('terms.adminText') }}</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">{{ i18n.t('terms.privacyTitle') }}</h2>
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.dataCollectedTitle') }}</h3>
        <p>{{ i18n.t('terms.dataCollectedTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.dataCollectedList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.dataCollectedExtraListTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.dataCollectedExtraList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.purposeTitle') }}</h3>
        <p>{{ i18n.t('terms.purposeTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.purposeList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.securityTitle') }}</h3>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.securityList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.photosTitle') }}</h3>
        <p>{{ i18n.t('terms.photosTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.photosList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.photosNote') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.sharingTitle') }}</h3>
        <p>{{ i18n.t('terms.sharingText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.retentionTitle') }}</h3>
        <p>{{ i18n.t('terms.retentionText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.cookiesTitle') }}</h3>
        <p>{{ i18n.t('terms.cookiesText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.rightsTitle') }}</h3>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.rightsList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.rightsNote') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.changesTitle') }}</h3>
        <p>{{ i18n.t('terms.changesText') }}</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">{{ i18n.t('terms.termsTitle') }}</h2>
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.usageTitle') }}</h3>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.usageList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.acceptanceTitle') }}</h3>
        <p>{{ i18n.t('terms.acceptanceTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.acceptanceList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.lawTitle') }}</h3>
        <p>{{ i18n.t('terms.lawText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.lawInternationalTitle') }}</h3>
        <p>{{ i18n.t('terms.lawInternationalText') }}</p>
      </section>
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-2">{{ i18n.t('terms.supplementaryTitle') }}</h2>
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.liabilityTitle') }}</h3>
        <p>{{ i18n.t('terms.liabilityTitle') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.liabilityList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.liabilityNote') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.suspensionTitle') }}</h3>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.suspensionList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.suspensionNote') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.terminationTitle') }}</h3>
        <p>{{ i18n.t('terms.terminationText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.disclaimerTitle') }}</h3>
        <p>{{ i18n.t('terms.disclaimerText') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.userContentTitle') }}</h3>
        <p>{{ i18n.t('terms.userContentText1') }}</p>
        <p>{{ i18n.t('terms.userContentText2') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.userContentList')" :key="item">{{ item }}</li>
        </ul>
        <p>{{ i18n.t('terms.userContentNote') }}</p>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.indemnityTitle') }}</h3>
        <p>{{ i18n.t('terms.indemnityText') }}</p>
        <ul class="list-disc pl-6 mb-2">
          <li v-for="item in i18n.t('terms.indemnityList')" :key="item">{{ item }}</li>
        </ul>
        <hr class="my-4 border-slate-200 dark:border-slate-700" />
        <h3 class="font-semibold mt-2">{{ i18n.t('terms.externalProcessorsTitle') }}</h3>
        <p>{{ i18n.t('terms.externalProcessorsText') }}</p>
      </section>
    </div>
  </div>
  <BackButton :label="i18n.t('common.back')" @click="$router.back()" />
</template>

<style scoped>
h1, h2, h3 {
}
</style>