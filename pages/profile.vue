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

definePageMeta({
  middleware: 'auth',
});

const authStore = useAuthStore();
const { setLanguage, update } = useAuth();

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
  showSuccess(t.value('profile.languageChanged'));
}

async function handleDeactivateAccount() {
  if (deactivateConfirmText.value !== 'DELETE') {
    showNotification(t.value('profile.deleteConfirmError'));
    return;
  }

  try {
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
  <div class="flex flex-col items-center justify-center w-full max-w-full px-1 sm:px-4">
    <h1 class="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light backdrop-blur">👤 {{ i18n.t('profile.title') }}</h1>
    <div class="mb-6 w-full max-w-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 flex flex-col border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60">
      <ProfileInformation
        :user="authStore.user"
        @update="handleProfileUpdate"
      />
    </div>

    <div class="mb-6 w-full max-w-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 flex flex-col border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60">
      <LanguageSettings @language-change="handleLanguageChange" />
    </div>

    <div class="mb-6 w-full max-w-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 flex flex-col border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60">
      <AccountActions
        @logout="handleLogout"
        @deactivate-account="openDeactivateModal"
      />
    </div>

    <DeactivateAccountModal
      :is-visible="showDeactivateConfirm"
      v-model:confirm-text="deactivateConfirmText"
      @close="closeDeactivateModal"
      @confirm="handleDeactivateAccount"
    />
  </div>
</template>
