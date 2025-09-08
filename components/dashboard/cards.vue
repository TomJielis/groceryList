<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCards } from '~/composables/useCards';

const { getCards, cards, deleteCard } = useCards();
const selectedCard = ref(null);
const isModalOpen = ref(false);

onMounted(async () => {
  await getCards();
});

function destroy(id: number) {
  if (confirm('Do you want to delete this card?')) {
    deleteCard(id);
  }
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
  <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white rounded-lg shadow p-6 flex flex-col items-center"
    >
      <h2 class="text-lg font-bold mb-2">{{ card.title }}</h2>
      <div class="bg-gray-100 p-4 rounded-lg w-full">
        <img :src="card.attachment" alt="Attachment" class="w-full h-auto mb-2 rounded cursor-pointer" @click="openModal(card)" />
      </div>
      <button class="mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="destroy(card.id)">
        Delete card
      </button>
    </div>
    <div
        class="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center text-gray-500 border-dashed border-2 border-gray-300"
    >
      <p class="mb-4">You did not add any card yet.</p>
      <NuxtLink to="/cards/upload">
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add card
        </button>
      </NuxtLink>
    </div>
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg p-4 max-w-sm w-full relative" @click.stop>
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="closeModal">
          &#x2715;
        </button>
        <img :src="selectedCard?.attachment" alt="Attachment Preview" class="w-full h-auto rounded mb-4" />
      </div>
    </div>
  </div>
</template>
