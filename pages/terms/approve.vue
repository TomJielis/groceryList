<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { useRouter } from 'vue-router';
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";

const authStore = useAuthStore();
const auth = useAuth();
const router = useRouter();

const approveTerms = async () => {
  const user = await auth.approveTerms();
  authStore.setUser(user)
  router.push('/');
};


const i18n = useI18nStore();


</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary-dark dark:text-accent-light mb-2">📄 Terms of Use & Privacy Policy – Grocery List</h1>
      <div class="text-sm text-slate-500 mb-4">Laatste versie: 1.2<br>Laatst bijgewerkt: 10-11-2025 16:30</div>
      <hr class="my-4 border-slate-200 dark:border-slate-700" />
    </div>
  </div>

  <button
      type="submit"
      @click="approveTerms"
      class="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
  >
    {{ i18n.t('approve meuk') }}
  </button>
</template>

<style scoped>
h1, h2, h3 {
}
</style>