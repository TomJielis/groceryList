<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import BackButton from "~/components/form/backButton.vue";
const config = useRuntimeConfig()

const i18n = useI18nStore();
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary-dark dark:text-accent-light mb-2">📄 Terms of Use & Privacy Policy – Grocery List</h1>
      <div class="text-sm text-slate-500 mb-4">Laatste versie: 1.2<br>Laatst bijgewerkt: 10-11-2025 16:30</div>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
    </div>
  </div>
</template>

<style scoped>
h1, h2, h3 {
}
</style>