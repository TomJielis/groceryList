<script setup lang="ts">
import {onMounted, ref} from 'vue';
import Card from 'primevue/card'
import Button from 'primevue/button'
import {useCards} from '~/composables/useCards';
import {useI18nStore} from '~/stores/i18n';
import deleteModal from '~/components/deleteModal.vue';
import {useNotification} from "~/composables/useNotification";

const emit = defineEmits<{
  (e: 'upload'): void
}>()

const {showNotification} = useNotification()
const i18n = useI18nStore()
const {getCards, cards, deleteCard} = useCards()
const selectedCard = ref(null)
const isModalOpen = ref(false)

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
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-surface-200 border-t-surface-400"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="cards.length === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div class="text-5xl mb-4">🎫</div>
      <h2 class="text-xl font-light mb-2">
        {{ i18n.t('cards.emptyState.title') }}
      </h2>
      <p class="text-sm text-color-secondary max-w-sm mb-6">
        {{ i18n.t('cards.emptyState.message') }}
      </p>
      <Button
        severity="primary"
        :label="i18n.t('cards.uploadFirst')"
        icon="pi pi-plus"
        @click="emit('upload')"
      />
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <transition-group name="card-list" tag="div" class="contents">
        <Card
          v-for="card in cards"
          :key="card.id"
          class="overflow-hidden group"
        >
          <template #header>
            <div class="flex items-center justify-between px-4 py-3 border-b border-surface-200">
              <h3 class="text-sm font-medium truncate">{{ card.title }}</h3>
              <Button
                severity="danger"
                text
                :title="i18n.t('cards.deleteBtn')"
                icon="pi pi-trash"
                class="flex-shrink-0 w-8 h-8"
                @click="destroy(card.id)"
              />
            </div>
          </template>

          <template #content>
            <!-- Card Image -->
            <div
              class="relative p-4 cursor-pointer"
              @click="openModal(card)"
            >
              <img
                :src="card.attachment"
                :alt="card.title"
                class="w-full h-auto object-contain max-h-56"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="px-4 py-3 border-t border-surface-200">
              <Button
                severity="secondary"
                text
                :label="i18n.t('cards.view')"
                icon="pi pi-eye"
                class="w-full justify-center"
                @click="openModal(card)"
              />
            </div>
          </template>
        </Card>
      </transition-group>
    </div>

    <!-- Full screen preview modal -->
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
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4"
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
            <!-- Close + Title bar -->
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-color-secondary">{{ selectedCard?.title }}</h3>
              <button
                @click="closeModal"
                class="w-9 h-9 flex items-center justify-center text-color-secondary hover:text-color transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Image -->
            <div class="rounded overflow-hidden">
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
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.card-list-move {
  transition: transform 0.3s ease;
}
</style>
