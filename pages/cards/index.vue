<script setup lang="ts">
import cardsComponent from "~/components/dashboard/cards.vue";
import {useI18nStore} from '~/stores/i18n';

definePageMeta({
  middleware: 'auth',
});

const i18n = useI18nStore();
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center max-w-8xl p-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light">🎫 {{ i18n.t('cards.available') }}</h1>
    <cardsComponent/>
  </div>
</template>

<style scoped>

</style>