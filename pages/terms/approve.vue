
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
  <div class="fixed inset-0 flex items-start justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-4 pt-4 pb-24 md:pt-16 md:pb-8 overflow-y-auto">
    <div class="w-full max-w-md my-4 md:my-8">
      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <span class="text-4xl">📋</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
            {{ i18n.t('termsApproval.title', 'Action Required: Approve New Terms') }}
          </h1>
          <p class="text-blue-100 text-sm">
            {{ i18n.t('termsApproval.body', 'To continue using this application, you must approve the new terms and conditions.') }}
          </p>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="approveTerms" class="space-y-6">
            <!-- Terms Checkbox -->
            <label
              class="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 cursor-pointer transition-all"
              :class="acceptedTerms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
            >
              <input
                type="checkbox"
                v-model="acceptedTerms"
                required
                class="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="text-sm text-slate-700 dark:text-slate-300 accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
            </label>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!acceptedTerms"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ i18n.t('termsApproval.approveBtn', 'Approve and Continue') }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.accept-terms-link) a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  font-weight: 600;
}
:deep(.accept-terms-link) a:hover {
  color: #1d4ed8;
}
</style>
