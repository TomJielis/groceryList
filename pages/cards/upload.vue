<script setup lang="ts">
import {ref} from "vue";
import { useCards } from "~/composables/useCards";
import {useRouter} from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import {useNotification} from "~/composables/useNotification";

definePageMeta({
  middleware: ['auth', 'terms'],
});
const {showNotification} = useNotification();
const i18n = useI18nStore();

const formData = ref({
  title: "",
  attachment: null as File | null,
});

const { storeCard , getCards} = useCards();
const router = useRouter();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.attachment = target.files[0];
  }
}

function handleSubmit() {
  if (!formData.value.attachment) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result as string;

    storeCard({
      title: formData.value.title,
      attachment: base64,
    }).then(() => {
      formData.value = {
        title: "",
        attachment: null,
      };

      getCards();
      router.push('/cards/');
    }).catch(() => {
      showNotification(i18n.t('errors.cardStoreFailed'));
    });


  };
  reader.readAsDataURL(formData.value.attachment);
}
</script>

<template>
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm touch-none">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="text-2xl">🃏</span>
              <span>{{ i18n.t('cards.upload') || 'Kaart uploaden' }}</span>
            </h1>
            <div class="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                {{ i18n.t('cards.uploadSubtitle') || 'Upload een foto of PDF' }}
              </span>
            </div>
          </div>
          <!-- Back Button -->
          <button
            @click="router.push('/cards/')"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-95"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="max-w-2xl mx-auto px-4 pb-24 pt-6">
        <form @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <!-- Form Content -->
          <div class="p-6 space-y-6">
            <!-- Title Input -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ i18n.t('cards.title') || 'Kaart naam' }}
              </label>
              <input
                v-model="formData.title"
                type="text"
                :placeholder="i18n.t('cards.titlePlaceholder') || 'Bijv. Albert Heijn Bonuskaart'"
                required
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
              />
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ i18n.t('cards.attachment') || 'Bestand' }}
              </label>
              <div class="relative">
                <input
                  @change="handleFileChange"
                  type="file"
                  id="attachment"
                  accept="image/*,application/pdf"
                  required
                  class="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600
                    file:text-white
                    hover:file:from-blue-700 hover:file:to-indigo-700
                    file:cursor-pointer file:transition-all
                    border-2 border-dashed border-slate-300 dark:border-slate-600
                    rounded-xl p-4
                    hover:border-blue-400 dark:hover:border-blue-500
                    transition-all duration-200
                    bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ i18n.t('cards.fileTypes') || 'Ondersteunt: JPG, PNG, PDF' }}</span>
              </p>

              <!-- Preview if file selected -->
              <div v-if="formData.attachment" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-green-700 dark:text-green-300">
                    {{ formData.attachment.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <div class="flex gap-3">
              <button
                type="button"
                @click="router.push('/cards/')"
                class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-98 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span>{{ i18n.t('common.cancel') || 'Annuleren' }}</span>
              </button>
              <button
                type="submit"
                :disabled="!formData.title || !formData.attachment"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-98 shadow-lg flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <span>{{ i18n.t('cards.uploadBtn') || 'Uploaden' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>