
<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '~/stores/i18n'
import { useRouter } from 'vue-router'
import {useAuth} from "~/composables/useAuth";
import { useAuthStore} from "~/stores/auth";

const authStore = useAuthStore();
const auth = useAuth();
const i18n = useI18nStore()
const router = useRouter()
const acceptedTerms = ref(false)

onMounted(async () => {
  try {
    const user = await auth.me()
    if (user) authStore.setUser(user)
  } catch {}
})

const approveTerms = async () => {
  const user = await auth.approveTerms();
  authStore.setUser(user)
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
    <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full border border-border-light dark:border-border-dark">
      <h1 class="text-2xl font-bold text-center mb-4 text-primary-dark dark:text-accent-light">
        {{ i18n.t('termsApproval.title', 'Action Required: Approve New Terms') }}
      </h1>
      <p class="mb-6 text-center text-slate-700 dark:text-slate-300">
        {{ i18n.t('termsApproval.body', 'To continue using this application, you must approve the new terms and conditions.') }}
      </p>
      <form @submit.prevent="handleApprove">
        <label class="flex items-center gap-2 mb-6">
          <input type="checkbox" v-model="acceptedTerms" required />
          <span class="accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
        </label>
        <button
            @click="approveTerms"
            type="submit"
            class="w-full bg-accent py-3 rounded-xl hover:bg-accent-dark active:scale-95 transition font-semibold shadow border border-accent/80 focus:ring-2 focus:ring-accent"
            :disabled="!acceptedTerms"
        >
          {{ i18n.t('termsApproval.approveBtn', 'Approve and Continue') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.accept-terms-link) a {
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
:deep(.accept-terms-link) a:hover {
  color: var(--color-accent, #6366f1) !important;
}
</style>
