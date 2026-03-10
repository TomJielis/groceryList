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
  <div class="profile-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-4 py-10">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div class="profile-hero rounded-3xl border border-white/10 shadow-2xl p-8 text-white space-y-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('profile.title') || 'Profiel' }}
            </p>
            <h1 class="text-3xl md:text-4xl font-bold">
              {{ authStore.user?.name || i18n.t('profile.hello') || 'Welkom terug' }}
            </h1>
            <p class="text-sm text-slate-300">
              {{ authStore.user?.email }}
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/profile/stats" class="profile-cta">
              <span>{{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}</span>
            </NuxtLink>
            <NuxtLink
              v-if="authStore.user?.is_admin"
              to="/admin"
              class="profile-cta secondary"
            >
              <span>{{ i18n.t('profile.adminDashboard') || 'Admin' }}</span>
            </NuxtLink>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="profile-stat">
            <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('lists.listCount') }}
            </p>
            <p class="text-2xl font-semibold">∞</p>
          </div>
          <div class="profile-stat">
            <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('lists.pending-lists') }}
            </p>
            <p class="text-2xl font-semibold text-amber-300">{{ i18n.t('lists.pending') || 'Live' }}</p>
          </div>
          <div class="profile-stat">
            <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('profile.language') }}
            </p>
            <p class="text-2xl font-semibold">{{ i18n.locale.toUpperCase() }}</p>
          </div>
          <div class="profile-stat">
            <p class="text-[11px] uppercase tracking-[0.3em] text-slate-300">
              {{ i18n.t('profile.accountActions') }}
            </p>
            <p class="text-2xl font-semibold text-emerald-300">Ready</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="profile-card">
          <div class="profile-card-header">
            <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2>{{ i18n.t('profile.information') || 'Profiel informatie' }}</h2>
          </div>
          <div class="profile-card-body">
            <ProfileInformation
              :user="authStore.user"
              @update="handleProfileUpdate"
            />
          </div>
        </div>

        <div class="profile-card">
          <PendingLists />
        </div>

        <NuxtLink to="/profile/stats" class="profile-link">
          <div class="profile-link-content">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/10 rounded-xl text-emerald-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h2>{{ i18n.t('profile.myStats') || 'Mijn Statistieken' }}</h2>
                <p>{{ i18n.t('profile.myStatsDescription') || 'Bekijk je item activiteit en top items' }}</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </NuxtLink>

        <NuxtLink
            v-if="authStore.user?.is_admin"
            to="/admin"
            class="profile-link secondary"
        >
          <div class="profile-link-content">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-500/20 rounded-xl text-purple-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h2>{{ i18n.t('profile.adminDashboard') || 'Admin Dashboard' }}</h2>
                <p>{{ i18n.t('profile.adminDashboardDescription') || 'Beheer gebruikers en bekijk statistieken' }}</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </NuxtLink>

        <div class="profile-card">
          <div class="profile-card-header">
            <svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
            </svg>
            <h2>{{ i18n.t('profile.language') || 'Taal' }}</h2>
          </div>
          <div class="profile-card-body">
            <LanguageSettings @language-change="handleLanguageChange" />
          </div>
        </div>

        <div class="profile-card">
          <div class="profile-card-header">
            <svg class="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h2>{{ i18n.t('profile.accountActions') || 'Account acties' }}</h2>
          </div>
          <div class="profile-card-body">
            <AccountActions
              @logout="handleLogout"
              @deactivate-account="openDeactivateModal"
            />
          </div>
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
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.profile-hero {
  background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.35), rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(30px);
  color: #f8fafc;
}

.profile-cta {
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #f8fafc;
  font-weight: 600;
}

.profile-cta.secondary {
  border-color: rgba(168, 85, 247, 0.6);
  color: #e9d5ff;
}

.profile-stat {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.profile-card {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 1.75rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 25px 50px rgba(2, 6, 23, 0.35);
}

.profile-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  color: #f8fafc;
}

.profile-card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.profile-card-body {
  padding: 1.5rem;
}

.profile-link {
  display: block;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: #f8fafc;
  padding: 1.25rem 1.5rem;
  transition: border 0.2s ease;
}

.profile-link.secondary {
  border-color: rgba(147, 51, 234, 0.4);
}

.profile-link-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.profile-link-content h2 {
  font-weight: 600;
}

.profile-link-content p {
  font-size: 0.875rem;
  color: #cbd5f5;
}
</style>
