<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import deleteModal from '~/components/deleteModal.vue'
import Loader from '~/components/Loader.vue'
import { useRecipes } from '~/composables/useRecipes'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'
import { ingredientText, totalMinutes } from '~/utils/recipeFormat'
import type { TRecipe } from '~/types/TRecipe'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const { fetchRecipe, deleteRecipe, setFavorite } = useRecipes()
const { showNotification, showSuccess } = useNotification()
const i18n = useI18nStore()
const route = useRoute()
const router = useRouter()
const recipeId = Number(route.params.id)

const recipe = ref<TRecipe | null>(null)
const loading = ref(true)
const notFound = ref(false)
// The amounts are shown for this many servings
const servings = ref(1)

onMounted(async () => {
  try {
    recipe.value = await fetchRecipe(recipeId)
    servings.value = recipe.value.servings
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

const factor = computed(() => (recipe.value ? servings.value / recipe.value.servings : 1))

// "Uit Samen koken · Toegevoegd door Sanne"
const subtitle = computed(() => {
  if (!recipe.value) return ''
  const parts = []
  if (recipe.value.cookbook_name) parts.push(`${i18n.t('recipes.fromCookbook')} ${recipe.value.cookbook_name}`)
  if (recipe.value.created_by) parts.push(`${i18n.t('recipes.addedBy')} ${recipe.value.created_by.name}`)
  if (!recipe.value.editable) parts.push(i18n.t('recipes.readOnly'))
  return parts.join(' · ')
})

const hasNutrition = computed(() => recipe.value
  && [recipe.value.kcal, recipe.value.protein, recipe.value.carbs, recipe.value.fat].some(value => value !== null))

async function toggleFavorite() {
  if (!recipe.value) return
  const favorite = !recipe.value.favorite
  try {
    await setFavorite(recipe.value.id, favorite)
    recipe.value = { ...recipe.value, favorite }
    showSuccess(i18n.t(favorite ? 'recipes.favorited' : 'recipes.unfavorited'))
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  }
}

const showDeleteModal = ref(false)

async function confirmDelete() {
  showDeleteModal.value = false
  try {
    await deleteRecipe(recipeId)
    showSuccess(i18n.t('recipes.deleted'))
    router.replace('/recipes')
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  }
}
</script>

<template>
  <div class="recipe-shell px-4 py-6">
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <Loader v-if="loading" />

      <template v-else-if="notFound || !recipe">
        <PageHeader back-to="/recipes" :title="i18n.t('recipes.title')" />
        <p class="py-12 text-center text-sm text-surface-500">{{ i18n.t('recipes.notFound') }}</p>
      </template>

      <template v-else>
        <PageHeader back-to="/recipes" :title="recipe.title" :subtitle="subtitle">
          <template #actions>
            <div class="flex flex-wrap gap-2">
              <Button
                :icon="recipe.favorite ? 'pi pi-star-fill' : 'pi pi-star'"
                :label="i18n.t('recipes.favorite')"
                severity="secondary"
                :outlined="!recipe.favorite"
                data-testid="recipe-favorite"
                @click="toggleFavorite"
              />
              <Button
                v-if="recipe.editable"
                icon="pi pi-pencil"
                :label="i18n.t('recipes.edit')"
                severity="secondary"
                outlined
                @click="router.push(`/recipes/${recipe.id}/edit`)"
              />
              <Button
                v-if="recipe.editable"
                icon="pi pi-trash"
                :aria-label="i18n.t('recipes.delete')"
                severity="danger"
                text
                data-testid="recipe-delete"
                @click="showDeleteModal = true"
              />
            </div>
          </template>
        </PageHeader>

        <img
          v-if="recipe.image_url"
          :src="recipe.image_url"
          :alt="recipe.title"
          class="w-full max-h-[28rem] object-cover rounded"
        />

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="stat-card-item stat-card-accent-orange">
            <div class="stat-card-label">{{ i18n.t('recipes.time') }}</div>
            <div class="stat-card-value">{{ totalMinutes(recipe) }} {{ i18n.t('recipes.minutes') }}</div>
          </div>
          <div class="stat-card-item stat-card-accent-blue">
            <div class="stat-card-label">{{ i18n.t('recipes.level') }}</div>
            <div class="stat-card-value">{{ i18n.t(`recipes.difficulty.${recipe.difficulty}`) }}</div>
          </div>
          <div v-if="recipe.oven_minutes || recipe.oven_celsius" class="stat-card-item stat-card-accent-green">
            <div class="stat-card-label">{{ i18n.t('recipes.oven') }}</div>
            <div class="stat-card-value">
              <span v-if="recipe.oven_minutes">{{ recipe.oven_minutes }} {{ i18n.t('recipes.minutes') }}</span>
              <span v-if="recipe.oven_minutes && recipe.oven_celsius"> · </span>
              <span v-if="recipe.oven_celsius">{{ recipe.oven_celsius }} °C</span>
            </div>
          </div>
          <div v-if="recipe.kcal" class="stat-card-item stat-card-accent-green">
            <div class="stat-card-label">{{ i18n.t('recipes.kcal') }}</div>
            <div class="stat-card-value">{{ recipe.kcal }}</div>
          </div>
        </div>

        <div v-if="recipe.categories.length" class="flex flex-wrap gap-2">
          <span
            v-for="category in recipe.categories"
            :key="category"
            class="text-xs px-2 py-1 rounded border border-surface-200 text-surface-600"
          >{{ i18n.t(`recipes.category.${category}`) }}</span>
        </div>

        <p v-if="recipe.description" class="text-sm leading-relaxed whitespace-pre-line">{{ recipe.description }}</p>

        <div class="grid gap-8 md:grid-cols-5">
          <!-- Ingredients, for the number of servings chosen here -->
          <section class="md:col-span-2">
            <div class="flex items-center justify-between pb-3 border-b border-surface-200">
              <h2 class="font-semibold">{{ i18n.t('recipes.ingredients') }}</h2>
              <div class="flex items-center gap-1">
                <Button icon="pi pi-minus" text rounded severity="secondary" size="small" :disabled="servings <= 1"
                  :aria-label="`- ${i18n.t('recipes.servings')}`" @click="servings--" />
                <span class="text-sm w-24 text-center" data-testid="recipe-servings">{{ servings }} {{ i18n.t('recipes.servings') }}</span>
                <Button icon="pi pi-plus" text rounded severity="secondary" size="small" :disabled="servings >= 100"
                  :aria-label="`+ ${i18n.t('recipes.servings')}`" @click="servings++" />
              </div>
            </div>
            <ul class="divide-y divide-surface-100">
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="py-2 text-sm">
                {{ ingredientText(ingredient, i18n.locale, factor) }}
              </li>
            </ul>
          </section>

          <section class="md:col-span-3">
            <h2 class="font-semibold pb-3 border-b border-surface-200">{{ i18n.t('recipes.steps') }}</h2>
            <ol class="flex flex-col gap-4 pt-3">
              <li v-for="(step, index) in recipe.steps" :key="index" class="flex gap-3 text-sm leading-relaxed">
                <span class="font-semibold text-surface-400 w-6 flex-shrink-0">{{ index + 1 }}.</span>
                <span class="whitespace-pre-line">{{ step }}</span>
              </li>
            </ol>
          </section>
        </div>

        <section v-if="hasNutrition">
          <h2 class="font-semibold pb-3 border-b border-surface-200">{{ i18n.t('recipes.nutrition') }}</h2>
          <div class="flex flex-wrap gap-6 pt-3 text-sm">
            <span v-if="recipe.kcal !== null">{{ recipe.kcal }} {{ i18n.t('recipes.kcal') }}</span>
            <span v-if="recipe.protein !== null">{{ i18n.t('recipes.protein') }} {{ recipe.protein }} g</span>
            <span v-if="recipe.carbs !== null">{{ i18n.t('recipes.carbs') }} {{ recipe.carbs }} g</span>
            <span v-if="recipe.fat !== null">{{ i18n.t('recipes.fat') }} {{ recipe.fat }} g</span>
          </div>
        </section>

        <p v-if="recipe.source_url" class="text-sm text-surface-500">
          {{ i18n.t('recipes.source') }}:
          <a :href="recipe.source_url" target="_blank" rel="noopener noreferrer" class="underline break-all">{{ recipe.source_url }}</a>
        </p>
      </template>
    </div>
  </div>

  <deleteModal
    :is-visible="showDeleteModal"
    :title="i18n.t('recipes.deleteTitle')"
    :content="i18n.t('recipes.confirmDelete')"
    :item-name="recipe?.title || ''"
    :delete-button-text="i18n.t('recipes.delete')"
    :with-validation="false"
    @close="showDeleteModal = false"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.recipe-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}
</style>
