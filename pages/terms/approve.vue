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
  <div class="terms-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10 flex items-start justify-center">
    <div class="w-full max-w-md mx-auto flex flex-col gap-6 my-4 md:my-8">
      <!-- Header -->
      <div class="terms-hero text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
          <span class="text-4xl">📋</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">
          {{ i18n.t('termsApproval.title') }}
        </h1>
        <p class="text-slate-300 text-sm">
          {{ i18n.t('termsApproval.body') }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="terms-card">
        <form @submit.prevent="approveTerms" class="space-y-6">
          <!-- Terms Checkbox -->
          <label
            class="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
            :class="acceptedTerms ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600 hover:border-blue-400'"
          >
            <input
              type="checkbox"
              v-model="acceptedTerms"
              required
              class="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-slate-700 border-slate-600"
            />
            <span class="text-sm text-slate-300 accept-terms-link" v-html="i18n.t('register.acceptTerms')"></span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!acceptedTerms"
            class="terms-cta w-full"
          >
            {{ i18n.t('termsApproval.approveBtn') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.terms-hero {
  padding: 2rem;
  border-radius: 1.75rem;
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.terms-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.85));
  border-radius: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.terms-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  background: linear-gradient(120deg, #fbbf24, #f97316);
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.terms-cta:disabled {
  background: rgba(100, 116, 139, 0.5);
  color: rgba(248, 250, 252, 0.5);
  border-color: rgba(148, 163, 184, 0.3);
  box-shadow: none;
  cursor: not-allowed;
}

.terms-cta:not(:disabled):active {
  transform: translateY(2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.25);
}

:deep(.accept-terms-link) a {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
  font-weight: 600;
}

:deep(.accept-terms-link) a:hover {
  color: #93c5fd;
}
</style>
