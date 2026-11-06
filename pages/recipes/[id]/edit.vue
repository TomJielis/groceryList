<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '~/components/Loader.vue'
import RecipeForm from '~/components/recipes/RecipeForm.vue'
import { useCookbooks } from '~/composables/useCookbooks'
import { useRecipes } from '~/composables/useRecipes'
import { useI18nStore } from '~/stores/i18n'
import type { TRecipe } from '~/types/TRecipe'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const { fetchCookbooks } = useCookbooks()
const { fetchRecipe } = useRecipes()
const i18n = useI18nStore()
const route = useRoute()
const router = useRouter()
const recipeId = Number(route.params.id)
const backTo = `/recipes/${recipeId}`

const recipe = ref<TRecipe | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [loaded] = await Promise.all([fetchRecipe(recipeId), fetchCookbooks()])
    recipe.value = loaded
  } catch {
    recipe.value = null
  } finally {
    loading.value = false
  }
})

function saved(updated: TRecipe) {
  router.replace(`/recipes/${updated.id}`)
}
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <PageHeader :back-to="backTo" :title="i18n.t('recipes.edit')" :subtitle="recipe?.title" />
      <Loader v-if="loading" />
      <p v-else-if="!recipe" class="py-12 text-center text-sm text-surface-500">{{ i18n.t('recipes.notFound') }}</p>
      <!-- Shown in one of the user's cookbooks, but it lives in someone else's: only they change it -->
      <p v-else-if="!recipe.editable" class="py-12 text-center text-sm text-surface-500">{{ i18n.t('recipes.readOnlyEdit') }}</p>
      <RecipeForm v-else :recipe="recipe" @saved="saved" @cancel="router.push(backTo)" />
    </div>
  </div>
</template>
