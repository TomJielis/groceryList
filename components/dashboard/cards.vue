<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useCards} from '~/composables/useCards';
import {useI18nStore} from '~/stores/i18n';
import deleteModal from '~/components/deleteModal.vue';
import {useNotification} from "~/composables/useNotification";

const {showNotification} = useNotification();
const i18n = useI18nStore();
const {getCards, cards, deleteCard} = useCards();
const selectedCard = ref(null);
const isModalOpen = ref(false);

const showDeleteModal = ref(false);
const deleteCardId = ref<number | null>(null);
const deleteCardName = ref('');
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    await getCards();
  } catch (error) {
    // Errors are handled by the global error interceptor
    loading.value = false;
  }
  loading.value = false;
});

function destroy(id: number) {
  const card = cards.value.find((card: any) => card.id === id);
  deleteCardId.value = id;
  deleteCardName.value = card?.title || '';
  showDeleteModal.value = true;
}

function handleDeleteConfirm() {
  if (deleteCardId.value) {
    deleteCard(deleteCardId.value).catch(() => {
      showNotification(i18n.t('errors.cardDeleteFailed'));
    });

    closeDeleteModal();
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteCardId.value = null;
  deleteCardName.value = '';
}

function openModal(card: any) {
  selectedCard.value = card;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedCard.value = null;
}
</script>

<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">{{ i18n.t('common.loading') || 'Laden...' }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="cards.length === 0" class="flex flex-col items-center justify-center py-20 px-6">
      <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <span class="text-6xl">🎫</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
        {{ i18n.t('cards.emptyState.title') || 'Geen kaarten' }}
      </h2>
      <p class="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-8">
        {{ i18n.t('cards.emptyState.message') || 'Upload je eerste kortingskaart om deze overal bij de hand te hebben' }}
      </p>
      <NuxtLink
        to="/cards/upload"
        class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span>{{ i18n.t('cards.uploadFirst') || 'Upload je eerste kaart' }}</span>
      </NuxtLink>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <transition-group name="list" tag="div" class="contents">
        <div
          v-for="card in cards"
          :key="card.id"
          class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 overflow-hidden group"
        >
          <!-- Card Header -->
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <h3 class="font-bold text-slate-900 dark:text-white truncate">{{ card.title }}</h3>
              </div>
              <button
                @click="destroy(card.id)"
                class="flex-shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                :title="i18n.t('cards.deleteBtn') || 'Verwijderen'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Image -->
          <div
            class="relative bg-slate-50 dark:bg-slate-900 p-4 cursor-pointer group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors"
            @click="openModal(card)"
          >
            <img
              :src="card.attachment"
              :alt="card.title"
              class="w-full h-auto rounded-lg shadow-md object-contain max-h-64"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded-full p-3 shadow-lg">
                <svg class="w-8 h-8 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <button
              @click="openModal(card)"
              class="w-full py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>{{ i18n.t('cards.view') || 'Bekijken' }}</span>
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Modal for full screen preview -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4 backdrop-blur-sm overflow-hidden"
        @click="closeModal"
        @touchmove.prevent
      >
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="isModalOpen" class="relative w-full max-w-4xl max-h-[90vh]" @click.stop>
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Title -->
            <div class="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 rounded-t-2xl z-10">
              <h3 class="text-xl font-bold text-white drop-shadow-lg">{{ selectedCard?.title }}</h3>
            </div>

            <!-- Image -->
            <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <img
                :src="selectedCard?.attachment"
                :alt="selectedCard?.title"
                class="w-full h-auto max-h-[85vh] object-contain"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Delete Modal -->
    <deleteModal
        :is-visible="showDeleteModal"
        :title="i18n.t('cards.deleteTitle')"
        :content="i18n.t('cards.confirmDelete')"
        :item-name="deleteCardName"
        :delete-button-text="i18n.t('cards.deleteBtn')"
        :withValidation="true"
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<style scoped>
/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>

