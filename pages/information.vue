<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from "~/stores/auth";
import AppDownload from '~/components/info/AppDownload.vue';
import { useIosDownload } from '~/composables/useIosDownload';
import Card from 'primevue/card'
import Button from 'primevue/button'

const appName = useRuntimeConfig().public.appName

const i18n = useI18nStore();
const t = computed(() => i18n.t);
const auth = useAuthStore()

useHead({
  title: `${appName} — Manage Your Shopping Lists`,
  link: [{ rel: 'canonical', href: 'https://tomjielis.com/information' }],
  meta: [
    { name: 'description', content: `${appName} — create, manage and share personal shopping lists. Track spending, collaborate with family. Free and easy to use.` },
    { property: 'og:title', content: appName },
    { property: 'og:description', content: 'Create, manage and share personal shopping lists. Free and easy to use.' },
    { property: 'og:url', content: 'https://tomjielis.com/information' },
  ]
})

const features = [
  { icon: '📝', title: 'info.feature1Title', text: 'info.feature1Text' },
  { icon: '👨‍👩‍👧‍👦', title: 'info.feature2Title', text: 'info.feature2Text' },
  { icon: '🍝', title: 'info.featureRecipesTitle', text: 'info.featureRecipesText' },
  { icon: '⏱️', title: 'info.featureCookTitle', text: 'info.featureCookText' },
  { icon: '💳', title: 'info.feature3Title', text: 'info.feature3Text' },
  { icon: '⌚', title: 'info.featureWidgetTitle', text: 'info.featureWidgetText' },
  { icon: '💡', title: 'info.feature4Title', text: 'info.feature4Text' },
  { icon: '🔒', title: 'info.feature5Title', text: 'info.feature5Text' },
];

const lang = computed(() => (i18n.locale === 'nl' ? 'nl' : 'en'));

// "Werkt overal": the iPhone line says TestFlight while the app is in beta, the App Store afterwards (useIosDownload)
const { isTestFlight } = useIosDownload();
const platformLines = [isTestFlight ? 'info.pwaIOSTestFlight' : 'info.pwaIOS', 'info.pwaAndroid', 'info.pwaDesktop', 'info.pwaUpdates'];

// The App Store slides (GroceryListExpo/store-screenshots, the iCloud set), made smaller; they carry their own headline
const appScreens = computed(() => [
  '01-lists', '02-list', '03-recipe', '04-cook', '05-cookbook', '06-import', '07-add-products', '08-cards', '09-widget', '10-stats',
].map((name) => `/info-screenshots-app/${lang.value}/${name}.jpg`));

// The website on a laptop, with the demo data (GroceryListExpo/store-screenshots/tools/website.js)
const websiteScreens = computed(() => [
  { name: '01-lists', titleKey: 'info.webListsTitle', textKey: 'info.webListsText' },
  { name: '02-list', titleKey: 'info.webListTitle', textKey: 'info.webListText' },
  { name: '03-recipes', titleKey: 'info.webRecipesTitle', textKey: 'info.webRecipesText' },
  { name: '04-recipe', titleKey: 'info.webRecipeTitle', textKey: 'info.webRecipeText' },
].map((screen) => ({ ...screen, img: `/info-screenshots/${lang.value}/${screen.name}.jpg` })));

// The pictures fade in once the page is there. Reactive rather than a class added to the elements found then: switching
// the language makes new picture elements (the other language's pictures), which have to show too
const picturesShown = ref(false);
onMounted(() => {
  requestAnimationFrame(() => {
    picturesShown.value = true;
  });
});
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-12 ">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-surface-200">
        <div class="space-y-1">
          <h1 class="page-heading">
            {{ t('info.title') }}
          </h1>
          <p class="text-sm text-surface-500">
            {{ t('info.subtitle') }}
          </p>
        </div>
      </div>

      <!-- The apps first: iPhone and Android -->
      <AppDownload />

      <!-- Features -->
      <div>
        <h2 class="text-[1.4rem] font-light tracking-tight mb-6">{{ t('info.featuresTitle') }}</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <Card
            v-for="feature in features"
            :key="feature.title"
          >
            <template #content>
              <div class="flex gap-4">
                <span class="text-lg flex-shrink-0 w-6 text-center">{{ feature.icon }}</span>
                <div>
                  <p class="text-sm font-medium mb-0.5">{{ t(feature.title) }}</p>
                  <p class="text-sm text-color-secondary leading-relaxed">{{ t(feature.text) }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- The app on a phone: the App Store slides -->
      <div>
        <h2 class="text-[1.4rem] font-light tracking-tight mb-6">{{ t('info.screenMobileTitle') }}</h2>
        <p class="text-sm text-color-secondary leading-relaxed mb-6">{{ t('info.screenMobileText') }}</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" data-testid="app-screens">
          <img
            v-for="img in appScreens"
            :key="img"
            :src="img"
            :alt="t('info.screenMobileTitle')"
            class="info-img w-full rounded-xl border border-surface-200 shadow-sm transition-opacity duration-700"
            :class="{ loaded: picturesShown }"
            loading="lazy"
          />
        </div>
      </div>

      <!-- The website on a laptop -->
      <div>
        <h2 class="text-[1.4rem] font-light tracking-tight mb-3">{{ t('info.screensTitle') }}</h2>
        <p class="text-sm text-color-secondary leading-relaxed mb-10">{{ t('info.screensText') }}</p>

        <div class="flex flex-col gap-20">
          <div
              v-for="(block, index) in websiteScreens"
              :key="block.name"
              class="grid md:grid-cols-2 gap-10 items-center"
          >

            <!-- Image -->
            <div :class="index % 2 === 1 ? 'md:order-2' : ''">
              <img
                  :src="block.img"
                  :alt="t(block.titleKey)"
                  loading="lazy"
                  class="info-img w-full rounded-xl border border-surface-200 shadow-sm transition-opacity duration-700"
                  :class="{ loaded: picturesShown }"
              />
            </div>

            <!-- Text -->
            <div class="max-w-md">
              <p class="text-lg font-medium mb-2">
                {{ t(block.titleKey) }}
              </p>
              <p class="text-sm text-color-secondary leading-relaxed">
                {{ t(block.textKey) }}
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- Where it works: the apps, the website in a browser (installable on a computer) -->
      <div>
        <h2 class="text-[1.4rem] font-light tracking-tight mb-6">{{ t('info.crossPlatformTitle') }}</h2>
        <p class="text-sm text-color-secondary leading-relaxed mb-6">{{ t('info.pwaIntro') }}</p>
        <div class="flex flex-col">
          <div v-for="key in platformLines" :key="key"
               class="flex items-center gap-3 py-3 border-t border-surface-200 text-sm text-color-secondary">
            <span class="w-1 h-1 rounded-full bg-surface-300 flex-shrink-0"></span>
            {{ t(key) }}
          </div>
          <div class="border-t border-surface-200"></div>
        </div>
      </div>

      <!-- CTA -->
      <div v-if="!auth.user" class="border-t border-surface-200 pt-10">
        <h2 class="text-[1.4rem] font-light tracking-tight mb-3">{{ t('info.ctaTitle') }}</h2>
        <p class="text-sm text-color-secondary leading-relaxed mb-6">{{ t('info.ctaSubtitle') }}</p>
        <NuxtLink to="/auth/register">
          <Button
            severity="primary"
            :label="t('info.ctaButton')"
          />
        </NuxtLink>
      </div>

      <NuxtLink to="/support" class="text-sm underline text-color-secondary">{{ t('support.title') }}</NuxtLink>

    </div>
  </div>
</template>

<style scoped>
.info-img { opacity: 0; }
.info-img.loaded { opacity: 1; }
</style>
