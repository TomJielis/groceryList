<script setup lang="ts">
import {useAuthStore} from "~/stores/auth";
import { useI18nStore } from "~/stores/i18n";
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const i18n = useI18nStore();
const t = computed(() => i18n.t);
const route = useRoute();

const languageDropdownOpen = ref(false);

function setLocale(locale: 'nl' | 'en') {
  i18n.setLocale(locale);
  languageDropdownOpen.value = false;
}

function isActiveTab(path: string) {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/list/');
  }
  return route.path.startsWith(path);
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.language-dropdown')) {
    languageDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <nuxt-link to="/" class="navbar-brand">
        {{ t('nav.brand') }}
      </nuxt-link>

      <div class="navbar-links">
        <nuxt-link
          to="/information"
          class="navbar-link"
          :class="{ 'navbar-link--active': isActiveTab('/information') }"
        >
          {{ t('nav.info') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/"
          class="navbar-link"
          :class="{ 'navbar-link--active': isActiveTab('/') }"
        >
          {{ t('nav.lists') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/cards"
          class="navbar-link"
          :class="{ 'navbar-link--active': isActiveTab('/cards') }"
        >
          {{ t('nav.cards') }}
        </nuxt-link>

        <nuxt-link
          v-if="!authStore.user"
          to="/auth/login"
          replace
          class="navbar-link"
          :class="{ 'navbar-link--active': isActiveTab('/auth/login') }"
        >
          {{ t('nav.login') }}
        </nuxt-link>

        <nuxt-link
          v-if="authStore.user"
          to="/profile"
          class="navbar-link"
          :class="{ 'navbar-link--active': isActiveTab('/profile') }"
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

        <div class="relative language-dropdown">
          <button class="navbar-lang" @click="languageDropdownOpen = !languageDropdownOpen">
            {{ i18n.locale.toUpperCase() }}
          </button>
          <div v-if="languageDropdownOpen" class="navbar-dropdown">
            <a @click.prevent="setLocale('nl')" href="#" class="navbar-dropdown-item">
              <span>🇳🇱</span>
              <span>{{ t('nav.dutch') }}</span>
            </a>
            <a @click.prevent="setLocale('en')" href="#" class="navbar-dropdown-item">
              <span>🇺🇸</span>
              <span>{{ t('nav.english') }}</span>
            </a>
          </div>
        </div>
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
    display: block;
    height: 3rem;
    background: #18181b;
    border-bottom: 1px solid #27272a;
    font-family: 'DM Sans', system-ui, sans-serif;
  }
}

.navbar-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
}

.navbar-brand {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fafafa;
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
  transition: color 0.15s;
}

.navbar-brand:hover {
  color: #a1a1aa;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}

.navbar-link {
  font-size: 0.75rem;
  font-weight: 400;
  color: #52525b;
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  border-radius: 3px;
  transition: color 0.15s;
  letter-spacing: 0.01em;
}

.navbar-link:hover {
  color: #a1a1aa;
}

.navbar-link--active {
  color: #fafafa;
}

.navbar-cta {
  font-size: 0.68rem;
  font-weight: 600;
  color: #18181b;
  background: #fafafa;
  text-decoration: none;
  padding: 0.4rem 0.9rem;
  border-radius: 3px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-left: 0.5rem;
  transition: background 0.15s;
}

.navbar-cta:hover {
  background: #d4d4d8;
}

.navbar-lang {
  font-size: 0.68rem;
  font-weight: 500;
  color: #52525b;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.08em;
  transition: color 0.15s;
}

.navbar-lang:hover {
  color: #a1a1aa;
}

.navbar-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  width: 10rem;
  background: #1e1e21;
  border: 1px solid #27272a;
  border-radius: 4px;
  padding: 0.25rem;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}

.navbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: #a1a1aa;
  text-decoration: none;
  border-radius: 3px;
  transition: background 0.1s, color 0.1s;
}

.navbar-dropdown-item:hover {
  background: #27272a;
  color: #fafafa;
}
</style>
