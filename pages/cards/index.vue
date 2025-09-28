<script setup lang="ts">
import cardsComponent from "~/components/dashboard/cards.vue";
</script>

<template>
  <div class="h-[90vh] p-8 overflow-auto">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-green-700 mb-6 text-center">
        Beschikbare Kaarten
      </h1>
      <div class="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <cardsComponent/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>