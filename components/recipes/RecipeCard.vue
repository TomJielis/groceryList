<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import { totalMinutes } from '~/utils/recipeFormat'
import type { TRecipeSummary } from '~/types/TRecipe'

// One recipe in the overview: its photo (the small copy), title, time and servings; opens the recipe
defineProps<{ recipe: TRecipeSummary }>()

const i18n = useI18nStore()
</script>

<template>
  <NuxtLink
    :to="`/recipes/${recipe.id}`"
    class="recipe-card flex flex-col overflow-hidden"
    :data-testid="`recipe-card-${recipe.id}`"
  >
    <div class="recipe-card-photo relative">
      <img
        v-if="recipe.thumb_url"
        :src="recipe.thumb_url"
        :alt="recipe.title"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
      <span
        v-if="recipe.favorite"
        class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center recipe-card-star"
        :aria-label="i18n.t('recipes.favorite')"
      >
        <i class="pi pi-star-fill text-xs"></i>
      </span>
    </div>
    <div class="p-3 flex flex-col gap-1 min-w-0">
      <span class="font-medium truncate">{{ recipe.title }}</span>
      <span class="text-xs text-surface-500">
        {{ totalMinutes(recipe) }} {{ i18n.t('recipes.minutes') }} · {{ recipe.servings }} {{ i18n.t('recipes.servings') }}
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.recipe-card {
  background: var(--p-surface-0);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.15s;
}

.recipe-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.recipe-card-photo {
  aspect-ratio: 4 / 3;
  background: var(--p-surface-100);
}

.recipe-card-star {
  background: var(--p-surface-0);
  color: #fbbf24;
}
</style>
