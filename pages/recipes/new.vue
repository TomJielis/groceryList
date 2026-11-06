<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '~/components/Loader.vue'
import RecipeForm from '~/components/recipes/RecipeForm.vue'
import { useCookbooks } from '~/composables/useCookbooks'
import { useI18nStore } from '~/stores/i18n'
import type { TRecipe } from '~/types/TRecipe'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const { cookbooks, fetchCookbooks } = useCookbooks()
const i18n = useI18nStore()
const route = useRoute()
const router = useRouter()

// From the overview: the cookbook that was open there (?cookbook=12)
const cookbookId = Number(route.query.cookbook) || null
const backTo = cookbookId ? `/recipes?cookbook=${cookbookId}` : '/recipes'
const ready = ref(false)

onMounted(async () => {
  try {
    await fetchCookbooks()
  } finally {
    // Without a cookbook there's nowhere to put a recipe: the overview says to make one first
    if (cookbooks.value.length === 0) router.replace('/recipes')
    ready.value = true
  }
})

function saved(recipe: TRecipe) {
  router.replace(`/recipes/${recipe.id}`)
}
</script>

<template>
  <div class="px-4 py-6">
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <PageHeader :back-to="backTo" :title="i18n.t('recipes.new')" />
      <Loader v-if="!ready" />
      <RecipeForm v-else :cookbook-id="cookbookId" @saved="saved" @cancel="router.push(backTo)" />
    </div>
  </div>
</template>
