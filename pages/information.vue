<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed, onMounted } from 'vue';
import { useAuthStore } from "~/stores/auth";

const i18n = useI18nStore();
const t = computed(() => i18n.t);
const auth = useAuthStore()

const features = [
  { icon: '📝', title: 'info.feature1Title', text: 'info.feature1Text' },
  { icon: '👨‍👩‍👧‍👦', title: 'info.feature2Title', text: 'info.feature2Text' },
  { icon: '💳', title: 'info.feature3Title', text: 'info.feature3Text' },
  { icon: '💡', title: 'info.feature4Title', text: 'info.feature4Text' },
  { icon: '🔒', title: 'info.feature5Title', text: 'info.feature5Text' },
];

const screenshotBlocks = [
  { img: '/info-screenshots/list-page.png', alt: 'Overzicht van alle lijsten', titleKey: 'info.screenListPageTitle', textKey: 'info.screenListPageText' },
  { img: '/info-screenshots/grocerylist-items-open.png', alt: 'Open lijst met items', titleKey: 'info.screenItemsOpenTitle', textKey: 'info.screenItemsOpenText' },
  { img: '/info-screenshots/grocerylist-items-open-and-checked.png', alt: 'Lijst met afgevinkte en open items', titleKey: 'info.screenItemsCheckedTitle', textKey: 'info.screenItemsCheckedText' },
  { img: '/info-screenshots/add-items-to-groceryList.png', alt: 'Items toevoegen aan een lijst', titleKey: 'info.screenAddItemsTitle', textKey: 'info.screenAddItemsText' }
];

const phoneScreenshotBlocks = [
  { img: '/info-screenshots-mobile/groceryList.png', titleKey: 'info.mobileScreenLists', altKey: 'info.mobileScreenLists' },
  { img: '/info-screenshots-mobile/GroceryListItems.png', titleKey: 'info.mobileScreenItems', altKey: 'info.mobileScreenItems' },
  { img: '/info-screenshots-mobile/GroceryListAddItemsToList.png', titleKey: 'info.screenAddItemsTitle', altKey: 'info.screenAddItemsTitle' },
  { img: '/info-screenshots-mobile/Cards.png', titleKey: 'info.mobileScreenCards', altKey: 'info.mobileScreenCards' },
  { img: '/info-screenshots-mobile/profile.png', titleKey: 'info.mobileScreenProfile', altKey: 'info.mobileScreenProfile' }
];

onMounted(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.info-img').forEach(el => el.classList.add('loaded'))
  });
});
</script>

<template>
  <div class="px-6 py-16 font-['DM_Sans',system-ui,sans-serif]">
    <div class="w-full max-w-2xl mx-auto flex flex-col gap-16">

      <!-- Header -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h1 class="text-[1.8rem] font-light text-[#fafafa] tracking-tight leading-tight mb-3">{{ t('info.title') }}</h1>
        <p class="text-sm text-[#71717a] leading-relaxed">{{ t('info.subtitle') }}</p>
      </div>

      <!-- Features -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h2 class="text-[1.4rem] font-light text-[#fafafa] tracking-tight mb-6">{{ t('info.featuresTitle') }}</h2>
        <div class="flex flex-col">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex gap-4 py-4 border-t border-[#27272a]"
          >
            <span class="text-lg flex-shrink-0 w-6 text-center">{{ feature.icon }}</span>
            <div>
              <p class="text-sm font-medium text-[#fafafa] mb-0.5">{{ t(feature.title) }}</p>
              <p class="text-sm text-[#71717a] leading-relaxed">{{ t(feature.text) }}</p>
            </div>
          </div>
          <div class="border-t border-[#27272a]"></div>
        </div>
      </div>

      <!-- Desktop Screenshots -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h2 class="text-[1.4rem] font-light text-[#fafafa] tracking-tight mb-6">{{ t('info.screensTitle') }}</h2>
        <div class="flex flex-col gap-12">
          <div v-for="block in screenshotBlocks" :key="block.titleKey">
            <img
              :src="block.img"
              :alt="block.alt"
              loading="lazy"
              class="info-img w-full rounded border border-[#27272a] mb-4 opacity-0 transition-opacity duration-700"
            />
            <p class="text-sm font-medium text-[#fafafa] mb-1">{{ t(block.titleKey) }}</p>
            <p class="text-sm text-[#71717a] leading-relaxed">{{ t(block.textKey) }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile Screenshots -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h2 class="text-[1.4rem] font-light text-[#fafafa] tracking-tight mb-6">{{ t('info.screenMobileTitle') }}</h2>
        <p class="text-sm text-[#71717a] leading-relaxed mb-6">{{ t('info.screenMobileText') }}</p>
        <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
          <div v-for="m in phoneScreenshotBlocks" :key="m.img" class="flex flex-col gap-2">
            <img
              :src="m.img"
              :alt="t(m.altKey)"
              class="info-img w-full rounded border border-[#27272a] aspect-[9/19] object-contain opacity-0 transition-opacity duration-700"
              loading="lazy"
            />
            <span class="text-[0.6rem] uppercase tracking-[0.08em] text-[#71717a] text-center font-medium">{{ t(m.titleKey) }}</span>
          </div>
        </div>
      </div>

      <!-- PWA / Cross-platform -->
      <div>
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h2 class="text-[1.4rem] font-light text-[#fafafa] tracking-tight mb-6">{{ t('info.crossPlatformTitle') }}</h2>
        <p class="text-sm text-[#71717a] leading-relaxed mb-6">{{ t('info.pwaIntro') }}</p>
        <div class="flex flex-col">
          <div v-for="key in ['info.pwaDesktop', 'info.pwaAndroid', 'info.pwaIOS', 'info.pwaUpdates']" :key="key"
               class="flex items-center gap-3 py-3 border-t border-[#27272a] text-sm text-[#71717a]">
            <span class="w-1 h-1 rounded-full bg-[#3f3f46] flex-shrink-0"></span>
            {{ t(key) }}
          </div>
          <div class="border-t border-[#27272a]"></div>
        </div>
      </div>

      <!-- CTA -->
      <div v-if="!auth.user" class="border-t border-[#27272a] pt-10">
        <p class="text-[0.65rem] uppercase tracking-[0.14em] text-[#52525b] mb-2 font-medium">grocery list</p>
        <h2 class="text-[1.4rem] font-light text-[#fafafa] tracking-tight mb-3">{{ t('info.ctaTitle') }}</h2>
        <p class="text-sm text-[#71717a] leading-relaxed mb-6">{{ t('info.ctaSubtitle') }}</p>
        <NuxtLink
          to="/auth/register"
          class="inline-block bg-[#fafafa] text-[#18181b] py-3 px-6 rounded font-semibold text-[0.7rem] uppercase tracking-[0.08em] hover:bg-[#d4d4d8] transition-colors"
        >
          {{ t('info.ctaButton') }}
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.info-img { opacity: 0; }
.info-img.loaded { opacity: 1; }
</style>
