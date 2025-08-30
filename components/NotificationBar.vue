<template>
  <div
      v-if="message"
      class="fixed top-0 transform bg-orange-400 text-white p-4 text-center py-3 px-6 rounded-b-lg shadow-lg transition-transform flex items-center justify-between w-full"
      :class="{ 'translate-y-full': !visible, 'translate-y-0': visible }"
  >
    <span class="flex-1">{{ message }}</span>
  </div>
</template>
<script setup lang="ts">
import {useNotification} from '~/composables/useNotification';

const {message, visible} = useNotification();
</script>

<style scoped>
.translate-y-full {
  transform: translateY(-100%);
}
.translate-y-0 {
  transform: translateY(0);
}
.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>