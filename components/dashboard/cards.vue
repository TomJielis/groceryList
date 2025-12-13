<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useCards} from '~/composables/useCards';
import {useI18nStore} from '~/stores/i18n';
import deleteModal from '~/components/deleteModal.vue';
import {useNotification} from "~/composables/useNotification";
import AddButton from "~/components/form/addButton.vue";
import Loader from "~/components/Loader.vue";

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

function openModal(card) {
  selectedCard.value = card;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedCard.value = null;
}
</script>

<template>
  <div class="flex-1 min-h-0 flex flex-col overflow-y-auto space-y-6">
    <Loader v-if="loading" />
    <div
        v-else
        v-for="card in cards"
        :key="card.id"
        class="cursor-pointer bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 active:shadow-2xl border border-border-light dark:border-border-dark transition relative hover:shadow-2xl hover:border-accent/60 group"
    >
      <h2 class="text-base font-medium mb-3 text-center">{{ card.title }}</h2>
      <div class="bg-gray-50 p-3 rounded-lg">
        <img :src="card.attachment" alt="Attachment" class="w-full h-auto rounded cursor-pointer"
             @click="openModal(card)"/>
      </div>
      <button
          class="mt-3 w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 font-medium text-sm"
          @click="destroy(card.id)">
        🗑️ {{ i18n.t('cards.deleteBtn') }}
      </button>
    </div>
    <nuxtLink to="/cards/upload">
      <addButton/>
    </nuxtLink>

    <!-- Modal for image preview -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
         @click="closeModal">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 w-full md:max-w-lg md:w-full relative max-h-[95vh] overflow-auto" @click.stop>
        <button
            class="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 z-10 bg-white dark:bg-slate-800 shadow-md"
            @click="closeModal">
          ✕
        </button>
        <h3 class="text-base md:text-lg font-medium mb-2 md:mb-3 pr-8 text-slate-900 dark:text-slate-100">{{ selectedCard?.title }}</h3>
        <div class="w-full overflow-x-auto">
          <img :src="selectedCard?.attachment" alt="Attachment Preview" class="w-full h-auto rounded-lg object-contain max-h-[80vh] md:max-h-[70vh]"/>
        </div>
      </div>
    </div>

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
