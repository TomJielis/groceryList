<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

// Where a recipe link (https://<site>/auth/recipe/<code>) lands when the app isn't installed: with the app, iOS opens
// it in the app instead (apple-app-site-association claims /auth/*). Shows the recipe, and how to save it in the
// app, or that the link expired.
type Ingredient = { name: string; amount: number | null; unit: string }
type SharedRecipe = {
  title: string; description: string | null; servings: number; prep_minutes: number; cook_minutes: number | null;
  oven_minutes: number | null; image_url: string | null; ingredients: Ingredient[]; steps: string[]
}
type Preview =
  | { status: 'valid'; shared_by: string | null; recipe: SharedRecipe }
  | { status: 'expired' | 'not_found' | 'error' }

const config = useRuntimeConfig().public
const i18n = useI18nStore();
const route = useRoute();
const token = route.params.token as string;

const { data, pending } = await useFetch<{ data: Preview }>(`/api/recipeLink/${encodeURIComponent(token)}`);
const preview = computed<Preview | null>(() => data.value?.data ?? null);
const recipe = computed(() => (preview.value?.status === 'valid' ? preview.value.recipe : null));

const title = computed(() => {
  if (recipe.value) return recipe.value.title;
  if (preview.value?.status === 'expired') return i18n.t('recipeLink.expiredTitle');
  if (preview.value?.status === 'not_found') return i18n.t('recipeLink.notFoundTitle');
  return i18n.t('recipeLink.title');
});

const minutes = computed(() => recipe.value
  ? recipe.value.prep_minutes + (recipe.value.cook_minutes ?? 0) + (recipe.value.oven_minutes ?? 0)
  : 0);

// "1,5 el olijfolie" in Dutch, "1.5 el olijfolie" in English
const ingredientText = (ingredient: Ingredient) => {
  const amount = ingredient.amount === null ? ''
    : String(Math.round(ingredient.amount * 10) / 10).replace('.', i18n.locale === 'nl' ? ',' : '.');
  return [amount, ingredient.unit, ingredient.name].filter(Boolean).join(' ');
};

// Safari's Smart App Banner: "Open" (on this recipe) when the app is installed, "View" (App Store) when it isn't
const appStoreId = /id(\d+)/.exec(config.appStoreUrl || '')?.[1] ?? null;
const pageUrl = useRequestURL().href;
if (appStoreId) {
  useHead({ meta: [{ name: 'apple-itunes-app', content: `app-id=${appStoreId}, app-argument=${pageUrl}` }] });
}
</script>

<template>
  <div class="auth-page min-h-full flex items-center justify-center py-16 px-6">

    <Card class="w-full max-w-md overflow-hidden shadow-lg" :pt="{ body: { class: 'p-0' }, content: { class: 'p-0' } }">
      <template #header>
        <img v-if="recipe?.image_url" :src="recipe.image_url" :alt="recipe.title" class="w-full object-cover" style="aspect-ratio: 4 / 3" />
        <div class="auth-card-header">
          <div class="flex items-center gap-2 mb-4">
            <span class="auth-logo-dot"></span>
            <span class="auth-brand">{{ config.appName }}</span>
          </div>
          <div class="auth-title">{{ title }}</div>
          <div v-if="preview?.status === 'valid'" class="auth-subtitle">
            {{ i18n.t('recipeLink.sharedBy') }} {{ preview.shared_by ?? '?' }}
            · {{ minutes }} {{ i18n.t('recipeLink.minutes') }} · {{ recipe?.servings }} {{ i18n.t('recipeLink.servings') }}
          </div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <div v-if="pending">
            <ProgressSpinner style="width:28px;height:28px" strokeWidth="3" />
          </div>

          <template v-else-if="recipe">
            <p v-if="recipe.description" class="text-sm leading-relaxed">{{ recipe.description }}</p>

            <div>
              <h3 class="font-semibold mb-2">{{ i18n.t('recipeLink.ingredients') }}</h3>
              <ul class="text-sm leading-relaxed list-disc pl-5">
                <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredientText(ingredient) }}</li>
              </ul>
            </div>

            <div v-if="recipe.steps.length">
              <h3 class="font-semibold mb-2">{{ i18n.t('recipeLink.steps') }}</h3>
              <ol class="text-sm leading-relaxed list-decimal pl-5 flex flex-col gap-2">
                <li v-for="(step, index) in recipe.steps" :key="index">{{ step }}</li>
              </ol>
            </div>

            <p class="text-sm leading-relaxed">{{ i18n.t('recipeLink.howToSave') }}</p>
            <a v-if="config.appStoreUrl" :href="config.appStoreUrl" class="block">
              <Button :label="i18n.t('inviteLink.download')" icon="pi pi-apple" class="w-full" />
            </a>
          </template>

          <template v-else>
            <p class="text-sm leading-relaxed">
              {{ preview?.status === 'expired' ? i18n.t('recipeLink.expiredBody')
                : preview?.status === 'not_found' ? i18n.t('recipeLink.notFoundBody')
                : i18n.t('recipeLink.loadFailed') }}
            </p>
            <NuxtLink to="/" class="block">
              <Button :label="i18n.t('inviteLink.toSite')" class="w-full" />
            </NuxtLink>
          </template>

        </div>
      </template>
    </Card>

  </div>
</template>
