<script setup lang="ts">
import { onMounted } from 'vue'
import { useCards } from '~/composables/useCards'

const { getCards, cards } = useCards()

onMounted(async () => {
  await getCards()
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <!-- Kaarten tonen -->
    <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white rounded-lg shadow p-6 flex flex-col items-center"
    >
      <h2 class="text-lg font-bold mb-4">{{ card.title }}</h2>
      <div class="bg-gray-100 p-4 rounded-lg w-full">
        <img :src="card.attachment" alt="Attachment" class="w-full h-auto mb-2 rounded" />
      </div>
    </div>
    <div
        class="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center text-gray-500 border-dashed border-2 border-gray-300"
    >
      <p class="mb-4">Je hebt nog geen kaarten toegevoegd.</p>
      <NuxtLink to="/cards/upload">
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Voeg kaart toe
        </button>
      </NuxtLink>
    </div>

  </div>
</template>
