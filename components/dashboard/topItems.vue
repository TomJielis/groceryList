<script setup lang="ts">
const { items } = useList();
</script>
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Top Items</h2>
    <ul class="divide-y divide-gray-200">
      <li class="py-2 flex justify-between" v-for="item in items" :key="item.name">
        <span>{{ item.name }}</span>
        <span class="text-gray-400">Supermarket</span>
      </li>
    </ul>
  </div>
</template>
