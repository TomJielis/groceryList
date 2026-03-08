<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed, onMounted } from 'vue';

const i18n = useI18nStore();
const t = computed(() => i18n.t);
import {useAuthStore} from "~/stores/auth";
const auth = useAuthStore()

const features = [
  {
    icon: '📝',
    title: 'info.feature1Title',
    text: 'info.feature1Text',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'info.feature2Title',
    text: 'info.feature2Text',
  },
  {
    icon: '💳',
    title: 'info.feature3Title',
    text: 'info.feature3Text',
  },
  {
    icon: '💡',
    title: 'info.feature4Title',
    text: 'info.feature4Text',
  },
  {
    icon: '🔒',
    title: 'info.feature5Title',
    text: 'info.feature5Text',
  },
];


const screenshotBlocks = [
  {
    img: '/info-screenshots/list-page.png',
    alt: 'Overzicht van alle lijsten',
    titleKey: 'info.screenListPageTitle',
    textKey: 'info.screenListPageText'
  },
  {
    img: '/info-screenshots/grocerylist-items-open.png',
    alt: 'Open lijst met items',
    titleKey: 'info.screenItemsOpenTitle',
    textKey: 'info.screenItemsOpenText'
  },
  {
    img: '/info-screenshots/grocerylist-items-open-and-checked.png',
    alt: 'Lijst met afgevinkte en open items',
    titleKey: 'info.screenItemsCheckedTitle',
    textKey: 'info.screenItemsCheckedText'
  },
  {
    img: '/info-screenshots/add-items-to-groceryList.png',
    alt: 'Items toevoegen aan een lijst',
    titleKey: 'info.screenAddItemsTitle',
    textKey: 'info.screenAddItemsText'
  }
];

const phoneScreenshotBlocks = [
  {
    img: '/info-screenshots-mobile/groceryList.png',
    titleKey: 'info.mobileScreenLists',
    altKey: 'info.mobileScreenLists'
  },
  {
    img: '/info-screenshots-mobile/GroceryListItems.png',
    titleKey: 'info.mobileScreenItems',
    altKey: 'info.mobileScreenItems'
  },
  {
    img: '/info-screenshots-mobile/GroceryListAddItemsToList.png',
    titleKey: 'info.screenAddItemsTitle',
    altKey: 'info.screenAddItemsTitle'
  },
  {
    img: '/info-screenshots-mobile/Cards.png',
    titleKey: 'info.mobileScreenCards',
    altKey: 'info.mobileScreenCards'
  },
  {
    img: '/info-screenshots-mobile/profile.png',
    titleKey: 'info.mobileScreenProfile',
    altKey: 'info.mobileScreenProfile'
  }
];

onMounted(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.info-img').forEach(el => el.classList.add('loaded'))
  });
});
</script>

<template>
  <div class="flex flex-col">
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
      <!-- Hero Header -->
      <header class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10"></div>
        <div class="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <span class="text-2xl">🛒</span>
            <span class="text-sm font-semibold text-blue-700 dark:text-blue-300">{{ t('info.badge') || 'Grocerylist App' }}</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            {{ t('info.title') }}
          </h1>
          <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {{ t('info.subtitle') }}
          </p>
        </div>
      </header>

    <!-- Features Section -->
    <section class="max-w-5xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{{ t('info.featuresTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{{ t('info.featuresSubtitle') || 'Ontdek wat je allemaal kunt met onze app' }}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-all duration-200 group"
        >
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {{ feature.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ t(feature.title) }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ t(feature.text) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Section -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{{ t('info.screensTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{{ t('info.screensIntro') }}</p>
      </div>

      <div class="space-y-24">
        <div
          v-for="(block, idx) in screenshotBlocks"
          :key="block.titleKey"
          class="flex flex-col lg:flex-row gap-8 items-center"
          :class="{ 'lg:flex-row-reverse': idx % 2 === 1 }"
        >
          <div class="flex-1 lg:max-w-2xl">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <img
                :src="block.img"
                :alt="block.alt"
                loading="lazy"
                class="info-img w-full object-cover opacity-0 transition-opacity duration-700"
              />
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-1 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
                {{ t(block.titleKey) }}
              </h3>
            </div>
            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{{ t(block.textKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile Screenshots Section -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{{ t('info.screenMobileTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{{ t('info.screenMobileText') }}</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          v-for="m in phoneScreenshotBlocks"
          :key="m.img"
          class="group flex flex-col items-center gap-3"
        >
          <div class="relative w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
            <img
              :src="m.img"
              :alt="t(m.altKey)"
              class="info-img w-full aspect-[9/19] object-contain p-3 opacity-0 transition-opacity duration-700"
              loading="lazy"
            />
          </div>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">{{ t(m.titleKey) }}</span>
        </div>
      </div>
    </section>

    <!-- Cross-Platform Section -->
    <section class="max-w-5xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{{ t('info.crossPlatformTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{{ t('info.crossPlatformIntro') }}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl mb-4">
            💻
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">{{ t('info.desktopTitle') }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.desktopText') }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl mb-4">
            📱
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">{{ t('info.mobileTitle') }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.mobileText') }}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl mb-4">
            🧩
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">{{ t('info.tabletTitle') }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.tabletText') }}</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl">
            🌐
          </div>
          <h3 class="font-bold text-xl text-slate-900 dark:text-white">{{ t('info.pwaTitle') }}</h3>
        </div>
        <p class="text-slate-600 dark:text-slate-400 mb-4">{{ t('info.pwaIntro') }}</p>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaDesktop') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaAndroid') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaIOS') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaUpdates') }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-5xl mx-auto px-4 pb-24" v-if="!auth.user">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-12 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <span class="text-4xl">🚀</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              {{ t('info.ctaTitle') }}
            </h2>
            <p class="text-blue-100 max-w-2xl mx-auto text-lg">
              {{ t('info.ctaSubtitle') || 'Begin vandaag nog met het organiseren van je boodschappen' }}
            </p>
          </div>
          <NuxtLink
            to="/auth/register"
            class="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
            <span>{{ t('info.ctaButton') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.info-img { opacity: 0; }
.info-img.loaded { opacity: 1; }
.screenshot-row { scroll-margin-top: 5rem; }
</style>
