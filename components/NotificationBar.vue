<template>
  <div
      v-if="message"
      class="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-3 shadow-lg transition-transform"
      :class="{ 'translate-y-full': !visible, 'translate-y-0': visible }"
  >
    {{ message }}
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