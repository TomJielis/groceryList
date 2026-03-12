<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const route = useRoute();

const localeOptions = [
  { label: '🇳🇱 NL', value: 'nl' },
  { label: '🇺🇸 EN', value: 'en' },
];

const selectedLocale = computed({
  get: () => i18n.locale,
  set: (val) => i18n.setLocale(val as 'nl' | 'en'),
});

function isActiveTab(path: string) {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/list/');
  }
  return route.path.startsWith(path);
}
</script>

<template>
  <nav class="navbar app-navbar">
    <div class="navbar-inner">
      <nuxt-link to="/" class="navbar-brand-link">
        <div class="flex items-center gap-2">
          <span class="app-navbar-logo-dot"></span>
          <span class="app-navbar-brand">GroceryList</span>
        </div>
      </nuxt-link>

      <div class="navbar-links">
        <nuxt-link
          to="/information"
          class="app-navbar-link"
          :class="{ active: isActiveTab('/information') }"
        >
          {{ t('nav.info') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/"
          class="app-navbar-link"
          :class="{ active: isActiveTab('/') }"
        >
          {{ t('nav.lists') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/cards"
          class="app-navbar-link"
          :class="{ active: isActiveTab('/cards') }"
        >
          {{ t('nav.cards') }}
        </nuxt-link>

        <nuxt-link
          v-if="!authStore.user"
          to="/auth/login"
          replace
          class="app-navbar-link"
          :class="{ active: isActiveTab('/auth/login') }"
        >
          {{ t('nav.login') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/profile"
          class="app-navbar-link"
          :class="{ active: isActiveTab('/profile') }"
        >
          {{ t('nav.profile') }}
        </nuxt-link>

        <nuxt-link
          v-if="!authStore.user"
          to="/auth/register"
          replace
          class="navbar-cta"
        >
          {{ t('nav.register') }}
        </nuxt-link>

        <Select
          v-model="selectedLocale"
          :options="localeOptions"
          optionLabel="label"
          optionValue="value"
          class="navbar-locale-select"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: none;
}

@media (min-width: 768px) {
  .navbar {
    display: flex;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
}

.navbar-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.navbar-brand-link {
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}

.navbar-cta {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--app-navy);
  background: var(--p-primary-color);
  text-decoration: none;
  padding: 0.4rem 0.9rem;
  border-radius: 3px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-left: 0.5rem;
  transition: background 0.15s;
}

.navbar-cta:hover {
  background: var(--p-primary-400);
}

.navbar-locale-select {
  margin-left: 0.5rem;
  min-width: 5rem;
}
</style>
