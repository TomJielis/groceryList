<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useI18nStore } from '~/stores/i18n';
import { useNotification } from '~/composables/useNotification';
import { useRouter } from 'vue-router';
import ProfileInformation from '~/components/profile/ProfileInformation.vue';
import LanguageSettings from '~/components/profile/LanguageSettings.vue';
import AccountActions from '~/components/profile/AccountActions.vue';
import DeactivateAccountModal from '~/components/profile/DeactivateAccountModal.vue';
import {useAuth} from "~/composables/useAuth";
import PendingLists from "~/components/list/PendingGroceryList.vue";

definePageMeta({
  middleware: ['auth', 'terms'],
});

const authStore = useAuthStore();
const { setLanguage, update, deactivate } = useAuth();

const i18n = useI18nStore();
const { showNotification, showSuccess } = useNotification();
const router = useRouter();

const t = computed(() => i18n.t);

const showDeactivateConfirm = ref(false);
const deactivateConfirmText = ref('');

async function handleProfileUpdate(userData: { name: string; email: string }) {
  try {
    await update(userData)
    authStore.setUser({ ...authStore.user, name: userData.name, email: userData.email });
    showSuccess(t.value('profile.profileUpdated'));
  } catch (error) {
    showNotification(t.value('errors.profileUpdateFailed'));
  }
}

function handleLanguageChange(locale: 'nl' | 'en') {
  setLanguage(locale);
  i18n.setLocale(locale);
  if (authStore.user) authStore.setLanguage(locale);
  showSuccess(t.value('profile.languageChanged'));
}

async function handleDeactivateAccount() {
  if (deactivateConfirmText.value !== 'DELETE') {
    showNotification(t.value('profile.deleteConfirmError'));
    return;
  }
  try {
    deactivate();
    authStore.clearAuth();
    router.push('/auth/login');
    showSuccess(t.value('profile.accountDeactivated'));
  } catch (error) {
    showNotification(t.value('errors.deactivateAccountFailed'));
  }
}

function openDeactivateModal() { showDeactivateConfirm.value = true; }
function closeDeactivateModal() { showDeactivateConfirm.value = false; deactivateConfirmText.value = ''; }
function handleLogout() { authStore.clearAuth(); router.push('/auth/login'); }
</script>

<template>
  <div class="profile-shell px-4 py-6">
    <div class="w-full max-w-2xl mx-auto flex flex-col gap-8">

      <!-- Header -->
      <div class="py-4 border-b border-surface-200">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0 text-white"
            style="background: var(--p-primary-color)"
          >
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>
          <div>
            <h1 class="page-heading">{{ authStore.user?.name || i18n.t('profile.hello') }}</h1>
            <p class="text-sm text-surface-500 mt-0.5">{{ authStore.user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Information -->
      <div>
        <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 mb-3">
          {{ i18n.t('profile.information') }}
        </p>
        <div class="list-item-row rounded p-5">
          <ProfileInformation :user="authStore.user" @update="handleProfileUpdate" />
        </div>
      </div>

      <!-- Pending Lists -->
      <div>
        <PendingLists />
      </div>

      <!-- Navigation Links -->
      <div class="divide-y divide-surface-100">
        <NuxtLink to="/profile/stats" class="flex items-center justify-between py-4 group">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded flex items-center justify-center text-surface-400 group-hover:text-surface-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium group-hover:text-surface-900 transition-colors">{{ i18n.t('profile.myStats') }}</p>
              <p class="text-xs text-surface-500">{{ i18n.t('profile.myStatsDescription') }}</p>
            </div>
          </div>
          <svg class="w-4 h-4 text-surface-300 group-hover:text-surface-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.user?.is_admin"
          to="/admin"
          class="flex items-center justify-between py-4 group"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded flex items-center justify-center text-surface-400 group-hover:text-surface-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium group-hover:text-surface-900 transition-colors">{{ i18n.t('profile.adminDashboard') }}</p>
              <p class="text-xs text-surface-500">{{ i18n.t('profile.adminDashboardDescription') }}</p>
            </div>
          </div>
          <svg class="w-4 h-4 text-surface-300 group-hover:text-surface-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Language Settings -->
      <div>
        <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 mb-3">
          {{ i18n.t('profile.language') }}
        </p>
        <LanguageSettings @language-change="handleLanguageChange" />
      </div>

      <!-- Account Actions -->
      <div>
        <p class="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-surface-400 mb-3">
          {{ i18n.t('profile.accountActions') }}
        </p>
        <div class="list-item-row rounded p-5">
          <AccountActions @logout="handleLogout" @deactivate-account="openDeactivateModal" />
        </div>
      </div>

    </div>

    <DeactivateAccountModal
      :is-visible="showDeactivateConfirm"
      v-model:confirm-text="deactivateConfirmText"
      @close="closeDeactivateModal"
      @confirm="handleDeactivateAccount"
    />
  </div>
</template>

<style scoped>
.profile-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}
</style>
