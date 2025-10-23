<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
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

onMounted(async () => {
  await getCards();
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
    <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 transition hover:shadow-2xl hover:border-accent/60 border border-border-light dark:border-border-dark flex flex-col gap-3"
    >
      <h2 class="text-lg font-bold mb-2 text-primary-dark dark:text-accent-light">{{ card.title }}</h2>
      <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex items-center justify-center">
        <img :src="card.attachment" alt="Attachment" class="w-full h-auto rounded-xl cursor-pointer shadow-md hover:shadow-xl transition" @click="openModal(card)"/>
      </div>
      <button
          class="mt-3 w-full px-4 py-2 bg-error hover:bg-error/90 text-white rounded-xl shadow-md font-semibold transition active:scale-95 border border-error/80 focus:ring-2 focus:ring-error"
          @click="destroy(card.id)">
        🗑️ {{ i18n.t('cards.deleteBtn') }}
      </button>
    </div>

<!--    <div-->
<!--        class="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 border-dashed border-2 border-border-light dark:border-border-dark"-->
<!--    >-->
<!--      <p class="mb-3 text-base" v-if="cards.length === 0">{{ i18n.t('cards.noCards') }}</p>-->
      <NuxtLink to="/cards/upload">
<!--        <button-->
<!--            class="px-5 py-3 bg-accent text-white rounded-xl shadow-md hover:bg-accent-dark active:scale-95 transition border border-accent/80 font-semibold text-base focus:ring-2 focus:ring-accent">-->
<!--          ➕ {{ i18n.t('cards.addBtn') }}-->
<!--        </button>-->
        <button
            class="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-4xl transition md:hidden border-4 border-white dark:border-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800"
            to="/cards/upload"
        >
          <span class="pb-1">+</span>
        </button>
      </NuxtLink>
<!--    </div>-->

    <!-- Modal for image preview -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur" @click="closeModal">
      <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl border border-border-light dark:border-border-dark" @click.stop>
        <button
            class="absolute top-2 right-2 text-slate-400 hover:text-accent w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent/10 transition"
            @click="closeModal">
          ✕
        </button>
        <h3 class="text-lg font-bold mb-4 pr-10 text-primary-dark dark:text-accent-light">{{ selectedCard?.title }}</h3>
        <img :src="selectedCard?.attachment" alt="Attachment Preview" class="w-full h-auto rounded-xl shadow-md"/>
      </div>
    </div>

    <!-- Delete Modal -->
    <deleteModal
        :is-visible="showDeleteModal"
        :title="i18n.t('cards.deleteTitle')"
        :content="i18n.t('cards.confirmDelete')"
        :item-name="deleteCardName"
        :delete-button-text="i18n.t('cards.deleteBtn')"
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
    />
  </div>
</template>
