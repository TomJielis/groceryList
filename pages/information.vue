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
  <div class="info-shell min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden w-full px-4 py-10">
      <!-- Hero Header -->
      <header class="info-hero max-w-5xl mx-auto mb-10">
        <div class="text-center py-12 md:py-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <span class="text-2xl">🛒</span>
            <span class="text-sm font-semibold text-blue-300">{{ t('info.badge') }}</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            {{ t('info.title') }}
          </h1>
          <p class="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {{ t('info.subtitle') }}
          </p>
        </div>
      </header>

    <!-- Features Section -->
    <section class="max-w-5xl mx-auto py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('info.featuresTitle') }}</h2>
        <p class="text-slate-300 max-w-2xl mx-auto">{{ t('info.featuresSubtitle') }}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="info-card p-6 group"
        >
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {{ feature.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-white mb-2">{{ t(feature.title) }}</h3>
              <p class="text-sm text-slate-300 leading-relaxed">{{ t(feature.text) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Section -->
    <section class="max-w-6xl mx-auto py-16">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('info.screensTitle') }}</h2>
        <p class="text-slate-300 max-w-2xl mx-auto">{{ t('info.screensIntro') }}</p>
      </div>

      <div class="space-y-24">
        <div
          v-for="(block, idx) in screenshotBlocks"
          :key="block.titleKey"
          class="flex flex-col lg:flex-row gap-8 items-center"
          :class="{ 'lg:flex-row-reverse': idx % 2 === 1 }"
        >
          <div class="flex-1 lg:max-w-2xl">
            <div class="info-card overflow-hidden group hover:shadow-2xl transition-shadow duration-300 p-0">
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
              <div class="w-1 h-12 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
              <h3 class="text-2xl font-bold text-white">
                {{ t(block.titleKey) }}
              </h3>
            </div>
            <p class="text-lg text-slate-300 leading-relaxed">{{ t(block.textKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile Screenshots Section -->
    <section class="max-w-6xl mx-auto py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('info.screenMobileTitle') }}</h2>
        <p class="text-slate-300 max-w-2xl mx-auto">{{ t('info.screenMobileText') }}</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          v-for="m in phoneScreenshotBlocks"
          :key="m.img"
          class="group flex flex-col items-center gap-3"
        >
          <div class="relative w-full info-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 p-0">
            <img
              :src="m.img"
              :alt="t(m.altKey)"
              class="info-img w-full aspect-[9/19] object-contain p-3 opacity-0 transition-opacity duration-700"
              loading="lazy"
            />
          </div>
          <span class="text-xs font-semibold text-slate-300 text-center">{{ t(m.titleKey) }}</span>
        </div>
      </div>
    </section>

    <!-- Cross-Platform Section -->
    <section class="max-w-5xl mx-auto py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ t('info.crossPlatformTitle') }}</h2>
        <p class="text-slate-300 max-w-2xl mx-auto">{{ t('info.crossPlatformIntro') }}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <div class="info-card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl mb-4">
            💻
          </div>
          <h3 class="font-bold text-lg text-white mb-2">{{ t('info.desktopTitle') }}</h3>
          <p class="text-sm text-slate-300">{{ t('info.desktopText') }}</p>
        </div>
        <div class="info-card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl mb-4">
            📱
          </div>
          <h3 class="font-bold text-lg text-white mb-2">{{ t('info.mobileTitle') }}</h3>
          <p class="text-sm text-slate-300">{{ t('info.mobileText') }}</p>
        </div>
        <div class="info-card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl mb-4">
            🧩
          </div>
          <h3 class="font-bold text-lg text-white mb-2">{{ t('info.tabletTitle') }}</h3>
          <p class="text-sm text-slate-300">{{ t('info.tabletText') }}</p>
        </div>
      </div>
      <div class="info-card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
            🌐
          </div>
          <h3 class="font-bold text-xl text-white">{{ t('info.pwaTitle') }}</h3>
        </div>
        <p class="text-slate-300 mb-4">{{ t('info.pwaIntro') }}</p>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-sm text-slate-300">
            <svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaDesktop') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-300">
            <svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaAndroid') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-300">
            <svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaIOS') }}</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-slate-300">
            <svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ t('info.pwaUpdates') }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-5xl mx-auto pb-24" v-if="!auth.user">
      <div class="info-hero overflow-hidden">
        <div class="p-12 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
              <span class="text-4xl">🚀</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
              {{ t('info.ctaTitle') }}
            </h2>
            <p class="text-slate-300 max-w-2xl mx-auto">
              {{ t('info.ctaSubtitle') }}
            </p>
          </div>
          <NuxtLink
            to="/auth/register"
            class="info-cta inline-block"
          >
            {{ t('info.ctaButton') }}
          </NuxtLink>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.info-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.info-hero {
  padding: 2rem;
  border-radius: 1.75rem;
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.35), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.info-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.85));
  border-radius: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  box-shadow: 0 25px 55px rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(30px);
}

.info-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  background: linear-gradient(120deg, #fbbf24, #f97316);
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.info-cta:active {
  transform: translateY(2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.25);
}

.info-img { opacity: 0; }
.info-img.loaded { opacity: 1; }
.screenshot-row { scroll-margin-top: 5rem; }
</style>
