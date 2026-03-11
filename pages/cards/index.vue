<script setup lang="ts">
import { ref } from 'vue'
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
  <div class="cards-shell px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-[#27272a]">
        <div class="space-y-1">
          <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-1 font-medium">grocery list</p>
          <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight">
            {{ i18n.t('cards.manageYourCards') }}
          </h1>
          <p class="text-sm text-[#71717a]">{{ i18n.t('cards.subtitle') }}</p>
        </div>
        <div class="flex gap-3">
          <button
            v-if="showUploadPanel"
            type="button"
            class="cards-cta secondary"
            @click="closeUploadPanel"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span>{{ i18n.t('common.cancel') }}</span>
          </button>
          <button
            v-else
            type="button"
            class="cards-cta"
            @click="openUploadPanel"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>{{ i18n.t('cards.uploadNew') }}</span>
          </button>
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

<style scoped>
.cards-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}

.cards-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: #fafafa;
  color: #18181b;
  border: 1px solid transparent;
  transition: background 0.15s ease;
}

.cards-cta:hover {
  background: #d4d4d8;
}

.cards-cta.secondary {
  background: transparent;
  color: #71717a;
  border: 1px solid #27272a;
}

.cards-cta.secondary:hover {
  border-color: #52525b;
  color: #a1a1aa;
}
</style>
