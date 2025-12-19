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
import DarkMode from "~/components/profile/DarkMode.vue";

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
  <div class="fixed inset-0 md:pt-16 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
    <!-- Fixed Header -->
    <div class="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm touch-none">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="text-2xl">👤</span>
              <span>{{ i18n.t('profile.title') || 'Profiel' }}</span>
            </h1>
            <div class="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ authStore.user?.name || authStore.user?.email }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-6">
        <!-- Profile Information -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                {{ i18n.t('profile.information') || 'Profiel informatie' }}
              </h2>
            </div>
          </div>
          <div class="p-6">
            <ProfileInformation
              :user="authStore.user"
              @update="handleProfileUpdate"
            />
          </div>
        </div>

        <!-- Pending Lists -->
        <PendingLists />

        <!-- Language Settings -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
              </svg>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                {{ i18n.t('profile.language') || 'Taal' }}
              </h2>
            </div>
          </div>
          <div class="p-6">
            <LanguageSettings @language-change="handleLanguageChange" />
          </div>
        </div>

        <!-- Theme Settings -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <darkMode />
        </div>

        <!-- Account Actions -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                {{ i18n.t('profile.accountActions') || 'Account acties' }}
              </h2>
            </div>
          </div>
          <div class="p-6">
            <AccountActions
              @logout="handleLogout"
              @deactivate-account="openDeactivateModal"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Account Modal -->
    <DeactivateAccountModal
      :is-visible="showDeactivateConfirm"
      v-model:confirm-text="deactivateConfirmText"
      @close="closeDeactivateModal"
      @confirm="handleDeactivateAccount"
    />
  </div>
</template>
