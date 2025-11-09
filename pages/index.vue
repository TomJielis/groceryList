<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import { computed } from 'vue';

const i18n = useI18nStore();
const t = computed(() => i18n.t);

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
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
    <header class="text-center my-8 md:my-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-primary-dark dark:text-accent-light mb-3">
        {{ t('info.title') }}
      </h1>
      <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300">
        {{ t('info.subtitle') }}
      </p>
    </header>

    <main>
      <section id="features" class="my-12">
        <h2 class="text-3xl font-bold text-center mb-8 text-primary-dark dark:text-accent-light">
          {{ t('info.featuresTitle') }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition hover:shadow-2xl hover:border-accent/60"
          >
            <div class="flex items-center gap-4 mb-4">
              <span class="text-4xl">{{ feature.icon }}</span>
              <h3 class="text-xl font-bold text-primary-dark dark:text-accent-light">
                {{ t(feature.title) }}
              </h3>
            </div>
            <p class="text-slate-600 dark:text-slate-400">
              {{ t(feature.text) }}
            </p>
          </div>
        </div>
      </section>

      <section id="cta" class="text-center my-12">
        <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-8 border border-border-light dark:border-border-dark">
          <h2 class="text-3xl font-bold mb-4 text-primary-dark dark:text-accent-light">
            {{ t('info.ctaTitle') }}
          </h2>
          <nuxt-link
            to="/auth/register"
            class="inline-block bg-accent text-white py-3 px-8 rounded-xl hover:bg-accent-dark active:scale-95 transition font-semibold shadow-lg border border-accent/80 focus:ring-2 focus:ring-accent"
          >
            {{ t('info.ctaButton') }}
          </nuxt-link>
        </div>
      </section>
    </main>
  </div>
</template>

