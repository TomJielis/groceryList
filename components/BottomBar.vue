<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, ref, onMounted } from 'vue';
import { useGroceryList } from "~/composables/useGroceryList";

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);

const lists = ref([]);
const pendingCount = computed(() => lists.value.length);

onMounted(async () => {
  const result = await useGroceryList().fetchPendingLists();
  lists.value = result || [];
});
</script>


<template>
  <nav class="fixed bottom-0 left-0 right-0  flex justify-around items-center p-3 shadow-md md:hidden h-20">
    <nuxtLink v-if="authStore.user" to="/" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.lists') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/cards/" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.cards') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/login" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.login') }}</span>
    </nuxtLink>
    <nuxtLink v-if="!authStore.user" to="/auth/register" class="text-center flex-1">
      <span class="text-sm">{{ t('nav.register') }}</span>
    </nuxtLink>
    <nuxtLink v-if="authStore.user" to="/profile" class="text-center flex-1 relative">
      <span class="inline-flex items-center gap-1">
        <span class="text-sm">{{ t('nav.profile') }}</span>
        <span
            v-if="pendingCount > 0"
            class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold ml-1 mb-5"
            style="position: static;"
        >
          {{ pendingCount }}
        </span>
      </span>
    </nuxtLink>

  </nav>
</template>

<style scoped>
nav {
  z-index: 50;
}

nav a, nav button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
