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
import Card from 'primevue/card';

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

    authStore.setUser({
      ...authStore.user,
      name: userData.name,
      email: userData.email,
    });

    showSuccess(t.value('profile.profileUpdated'));
  } catch (error) {
    showNotification(t.value('errors.profileUpdateFailed'));
  }
}

function handleLanguageChange(locale: 'nl' | 'en') {
  setLanguage(locale);

  i18n.setLocale(locale);

  if (authStore.user) {
    authStore.setLanguage(locale);
  }

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

function openDeactivateModal() {
  showDeactivateConfirm.value = true;
}

function closeDeactivateModal() {
  showDeactivateConfirm.value = false;
  deactivateConfirmText.value = '';
}

function handleLogout() {
  authStore.clearAuth();
  router.push('/auth/login');
}
</script>

<template>
  <div class="profile-shell px-4 py-6">
    <div class="w-full max-w-2xl mx-auto flex flex-col">

      <!-- Header -->
      <div class="py-4 mb-4">
        <p class="page-eyebrow">grocery list</p>
        <h1 class="page-heading">
          {{ authStore.user?.name || i18n.t('profile.hello') }}
        </h1>
        <p class="text-sm mt-1">{{ authStore.user?.email }}</p>
      </div>

      <!-- Profile Information -->
      <div class="py-6">
        <p class="page-eyebrow">grocery list</p>
        <h2 class="text-[1.1rem] font-medium mb-4">{{ i18n.t('profile.information') }}</h2>
        <Card>
          <template #content>
            <ProfileInformation
              :user="authStore.user"
              @update="handleProfileUpdate"
            />
          </template>
        </Card>
      </div>

      <!-- Pending Lists -->
      <div class="py-6">
        <PendingLists />
      </div>

      <!-- Navigation Links -->
      <NuxtLink
        to="/profile/stats"
        class="flex items-center justify-between py-4 border-b group"
      >
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <div>
            <p class="text-sm font-medium transition-colors">{{ i18n.t('profile.myStats') }}</p>
            <p class="text-xs">{{ i18n.t('profile.myStatsDescription') }}</p>
          </div>
        </div>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </NuxtLink>

      <NuxtLink
        v-if="authStore.user?.is_admin"
        to="/admin"
        class="flex items-center justify-between py-4 border-b group"
      >
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <div>
            <p class="text-sm font-medium transition-colors">{{ i18n.t('profile.adminDashboard') }}</p>
            <p class="text-xs">{{ i18n.t('profile.adminDashboardDescription') }}</p>
          </div>
        </div>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </NuxtLink>

      <!-- Language Settings -->
      <div class="py-6">
        <p class="page-eyebrow">grocery list</p>
        <h2 class="text-[1.1rem] font-medium mb-4">{{ i18n.t('profile.language') }}</h2>
        <LanguageSettings @language-change="handleLanguageChange" />
      </div>

      <!-- Account Actions -->
      <div class="py-6">
        <p class="page-eyebrow">grocery list</p>
        <h2 class="text-[1.1rem] font-medium mb-4">{{ i18n.t('profile.accountActions') }}</h2>
        <Card>
          <template #content>
            <AccountActions
              @logout="handleLogout"
              @deactivate-account="openDeactivateModal"
            />
          </template>
        </Card>
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
