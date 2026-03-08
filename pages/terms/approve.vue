<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '~/stores/i18n'
import { useRouter } from 'vue-router'
import {useAuth} from "~/composables/useAuth";
import { useAuthStore} from "~/stores/auth";

definePageMeta({
  middleware: ['auth'],
})

const authStore = useAuthStore();
const auth = useAuth();
const i18n = useI18nStore()
const router = useRouter()
const acceptedTerms = ref(false)

onMounted(async () => {
  try {
    const user = await auth.me()
    if (user) {
      authStore.setUser(user)
    } else {
      authStore.clearAuth()
      // No user returned (unauthorized) -> redirect to login
      router.push('/auth/login')
    }
  } catch (err: any) {
    authStore.clearAuth()
    // If unauthorized or any failure fetching user, redirect to login
    router.push('/auth/login')
  }
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
        <div class="px-6 py-8 text-center border-b border-slate-200 dark:border-slate-700">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 mb-4">
            <span class="text-4xl">📋</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {{ i18n.t('termsApproval.title') }}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            {{ i18n.t('termsApproval.body') }}
          </p>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="approveTerms" class="space-y-6">
            <!-- Terms Checkbox -->
            <label
              class="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border cursor-pointer transition-all"
              :class="acceptedTerms ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'"
            >
              <input
                type="checkbox"
                v-model="acceptedTerms"
                required
                class="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="text-sm text-slate-600 dark:text-slate-400 accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
            </label>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!acceptedTerms"
              class="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95"
            >
              {{ i18n.t('termsApproval.approveBtn') }}
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
