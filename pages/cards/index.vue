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
  <div class="cards-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div class="cards-hero rounded-3xl border border-white/10 shadow-2xl p-8 text-white space-y-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.4em] text-slate-300">
              {{ i18n.t('cards.available') }}
            </p>
            <h1 class="text-3xl md:text-4xl font-bold">
              {{ i18n.t('cards.manageYourCards') }}
            </h1>
            <p class="text-sm text-slate-300">
              {{ i18n.t('cards.subtitle') }}
            </p>
          </div>
          <div class="flex gap-3">
            <button type="button" class="cards-cta" @click="openUploadPanel">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>{{ i18n.t('cards.uploadNew') }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="cards-panel rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6">
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
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.cards-hero {
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(30px);
}

.cards-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #0f172a;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  font-weight: 600;
}

.cards-stat {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
}

.cards-panel {
  background: rgba(15, 23, 42, 0.85);
  color: #f8fafc;
  box-shadow: 0 25px 50px rgba(2, 6, 23, 0.35);
}
</style>
