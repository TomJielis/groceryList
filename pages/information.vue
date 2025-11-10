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

definePageMeta({ layout: 'info' });

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

onMounted(() => {
  // Simple fade-in for images after mount
  requestAnimationFrame(() => {
    document.querySelectorAll('.info-img').forEach(el => el.classList.add('loaded'))
  });
});
</script>

<template>
  <div class="w-full">
    <header class="text-center py-12 md:py-20 px-4">
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
        {{ t('info.title') }}
      </h1>
      <p class="mt-6 text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
        {{ t('info.subtitle') }}
      </p>
    </header>

    <!-- Feature highlights -->
    <section class="px-4 md:px-10 lg:px-16 xl:px-24 py-10 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-t-[3rem] shadow-inner">
      <h2 class="text-3xl font-bold text-center mb-12 text-primary-dark dark:text-accent-light">{{ t('info.featuresTitle') }}</h2>
      <div class="grid lg:grid-cols-2 gap-12">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex gap-6 group"
        >
          <div class="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
            {{ feature.icon }}
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2 text-primary-dark dark:text-accent-light">{{ t(feature.title) }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ t(feature.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots paired layout -->
    <section class="px-4 md:px-10 lg:px-16 xl:px-24 py-20 space-y-16">
      <h2 class="text-3xl font-bold text-center mb-4 text-primary-dark dark:text-accent-light">{{ t('info.screensTitle') }}</h2>
      <p class="text-center text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">{{ t('info.screensIntro') }}</p>

      <div
        v-for="(block, idx) in screenshotBlocks"
        :key="block.titleKey"
        class="flex flex-col lg:flex-row gap-10 items-start lg:items-center screenshot-row"
        :class="{ 'lg:flex-row-reverse': idx % 2 === 1 }"
      >
        <figure class="flex-1 lg:flex-[1.35] relative group">
          <div class="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/60 dark:ring-slate-700/50 bg-white/90 dark:bg-slate-900/80 transition-transform duration-500 group-hover:scale-[1.02]">
            <img
              :src="block.img"
              :alt="block.alt"
              loading="lazy"
              width="1600"
              height="900"
              class="info-img w-full object-cover opacity-0 transition-opacity duration-700 ease-out"
            />
          </div>
          <figcaption class="sr-only">{{ t(block.titleKey) }}</figcaption>
          <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-50 transition"></div>
        </figure>
        <div class="flex-1 lg:flex-[0.65] max-w-2xl">
          <h3 class="text-2xl font-bold mb-4 text-primary-dark dark:text-accent-light flex items-center gap-2">
            <span class="inline-block w-12 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"></span>
            {{ t(block.titleKey) }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{{ t(block.textKey) }}</p>
        </div>
      </div>
    </section>

    <!-- Cross platform & PWA section -->
    <section class="px-4 md:px-10 lg:px-16 xl:px-24 pb-8">
      <div class="rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-xl p-10 space-y-10 border border-border-light dark:border-border-dark">
        <div class="text-center space-y-4">
          <h2 class="text-3xl font-bold text-primary-dark dark:text-accent-light">{{ t('info.crossPlatformTitle') }}</h2>
          <p class="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">{{ t('info.crossPlatformIntro') }}</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-900">
            <div class="text-3xl">💻</div>
            <h3 class="font-semibold text-lg">{{ t('info.desktopTitle') }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.desktopText') }}</p>
          </div>
          <div class="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-900">
            <div class="text-3xl">📱</div>
            <h3 class="font-semibold text-lg">{{ t('info.mobileTitle') }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.mobileText') }}</p>
          </div>
          <div class="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-900">
            <div class="text-3xl">🧩</div>
            <h3 class="font-semibold text-lg">{{ t('info.tabletTitle') }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('info.tabletText') }}</p>
          </div>
          <div class="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 md:col-span-2 lg:col-span-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🌐</span>
              <h3 class="font-semibold text-xl">{{ t('info.pwaTitle') }}</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ t('info.pwaIntro') }}</p>
            <ul class="list-disc ml-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>{{ t('info.pwaDesktop') }}</li>
              <li>{{ t('info.pwaAndroid') }}</li>
              <li>{{ t('info.pwaIOS') }}</li>
              <li>{{ t('info.pwaUpdates') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="px-4 md:px-10 lg:px-16 xl:px-24 pb-24" v-if="!auth.user">
      <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 rounded-3xl p-[3px] shadow-2xl">
        <div class="rounded-[2.4rem] bg-white/90 dark:bg-slate-900/90 p-10 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            {{ t('info.ctaTitle') }}
          </h2>
          <nuxt-link
            to="/auth/register"
            class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition focus:ring-4 focus:ring-indigo-400/40"
          >
            <span>🚀</span>{{ t('info.ctaButton') }}
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.info-img.loaded { opacity: 1; }
.screenshot-row { scroll-margin-top: 5rem; }
</style>
