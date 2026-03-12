<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import cardsComponent from '~/components/dashboard/cards.vue'
import CardUploadPanel from '~/components/cards/CardUploadPanel.vue'
import { useI18nStore } from '~/stores/i18n'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const i18n = useI18nStore()
const showUploadPanel = ref(false)

function openUploadPanel() {
  showUploadPanel.value = true
}

function closeUploadPanel() {
  showUploadPanel.value = false
}
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-surface-200">
        <div class="space-y-1">
          <p class="page-eyebrow">grocery list</p>
          <h1 class="page-heading">
            {{ i18n.t('cards.manageYourCards') }}
          </h1>
          <p class="text-sm text-color-secondary">{{ i18n.t('cards.subtitle') }}</p>
        </div>
        <div class="flex gap-3">
          <Button
            v-if="showUploadPanel"
            severity="secondary"
            :label="i18n.t('common.cancel')"
            icon="pi pi-times"
            @click="closeUploadPanel"
          />
          <Button
            v-else
            severity="primary"
            :label="i18n.t('cards.uploadNew')"
            icon="pi pi-plus"
            @click="openUploadPanel"
          />
        </div>
      </div>

      <div class="pt-2">
        <CardUploadPanel
          v-if="showUploadPanel"
          :visible="showUploadPanel"
          inline
          @close="closeUploadPanel"
          @uploaded="closeUploadPanel"
        />
        <cardsComponent
          v-else
          @upload="openUploadPanel"
        />
      </div>

    </div>
  </div>
</template>
