<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, onMounted } from 'vue';
import { useListStore } from '~/stores/lists';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const listStore = useListStore();
const route = useRoute();

const pendingCount = computed(() => listStore.pendingLists.length);

function setLocale(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
}

onMounted(() => {
  if (listStore.pendingLists.length === 0) {
    listStore.fetchPendingLists();
  }
});

function isActiveTab(path: string) {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/list/');
  }
  return route.path.startsWith(path);
}
</script>

<template>
  <nav class="bottombar">
    <nuxtLink
      v-if="!authStore.user"
      to="/information"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/information') }"
    >
      <i class="pi pi-info-circle bottombar-icon"></i>
      <span class="bottombar-label">{{ t('nav.info') }}</span>
    </nuxtLink>

    <nuxtLink
      v-if="authStore.user"
      to="/"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/') }"
    >
      <i class="pi pi-list bottombar-icon"></i>
      <span class="bottombar-label">{{ t('nav.lists') }}</span>
    </nuxtLink>

    <nuxtLink
      v-if="authStore.user"
      to="/cards"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/cards') }"
    >
      <i class="pi pi-credit-card bottombar-icon"></i>
      <span class="bottombar-label">{{ t('nav.cards') }}</span>
    </nuxtLink>

    <nuxtLink
      v-if="!authStore.user"
      to="/auth/login"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/auth/login') }"
    >
      <i class="pi pi-sign-in bottombar-icon"></i>
      <span class="bottombar-label">{{ t('nav.login') }}</span>
    </nuxtLink>

    <nuxtLink
      v-if="!authStore.user"
      to="/auth/register"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/auth/register') }"
    >
      <i class="pi pi-user-plus bottombar-icon"></i>
      <span class="bottombar-label">{{ t('nav.register') }}</span>
    </nuxtLink>

    <nuxtLink
      v-if="authStore.user"
      to="/profile"
      class="bottombar-tab"
      :class="{ 'bottombar-tab--active': isActiveTab('/profile') }"
    >
      <i class="pi pi-user bottombar-icon"></i>
      <span class="bottombar-label">
        {{ t('nav.profile') }}
        <span v-if="pendingCount > 0" class="bottombar-badge">{{ pendingCount }}</span>
      </span>
    </nuxtLink>

    <div v-if="!authStore.user" class="bottombar-tab">
      <button class="bottombar-lang-btn" @click="setLocale(i18n.locale === 'nl' ? 'en' : 'nl')">
        <span class="bottombar-lang-flag">{{ i18n.locale === 'nl' ? '🇳🇱' : '🇬🇧' }}</span>
        <span class="bottombar-label">{{ i18n.locale === 'nl' ? 'NL' : 'EN' }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.bottombar {
  height: 4rem;
  background: #18181b;
  border-top: 1px solid #27272a;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  font-family: 'DM Sans', system-ui, sans-serif;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (min-width: 768px) {
  .bottombar {
    display: none;
  }
}

.bottombar-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  text-decoration: none;
  color: #52525b;
  padding: 0.5rem 0.25rem;
  transition: color 0.15s;
  position: relative;
}

.bottombar-tab:hover {
  color: #a1a1aa;
}

.bottombar-tab--active {
  color: #fafafa;
}

.bottombar-tab--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1.25rem;
  height: 1px;
  background: #fafafa;
}

.bottombar-icon {
  font-size: 1rem;
}

.bottombar-label {
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.bottombar-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fafafa;
  color: #18181b;
  font-size: 0.45rem;
  font-weight: 700;
}

.bottombar-lang-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #52525b;
  font-family: 'DM Sans', sans-serif;
  padding: 0.5rem 0.25rem;
  width: 100%;
  transition: color 0.15s;
}

.bottombar-lang-btn:hover {
  color: #a1a1aa;
}

.bottombar-lang-flag {
  font-size: 1rem;
  line-height: 1;
}
</style>
