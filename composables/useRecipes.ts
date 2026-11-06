import { ref } from 'vue'
import type { TRecipe, TRecipeInput, TRecipeSummary } from '~/types/TRecipe'

// Shared across the pages: the overview's recipes, kept up to date by what the recipe pages save
const recipes = ref<TRecipeSummary[]>([])

/** The recipes of all the user's cookbooks. What may be changed is decided by the API (`editable` per recipe). */
export function useRecipes() {
    async function fetchRecipes(): Promise<void> {
        const response = await $fetch<{ data: TRecipeSummary[] }>('/api/recipes')
        recipes.value = response.data
    }

    async function fetchRecipe(id: number): Promise<TRecipe> {
        const response = await $fetch<{ data: TRecipe }>(`/api/recipes/${id}`)
        return response.data
    }

    // A new recipe without an id, otherwise saves the existing one again
    async function saveRecipe(input: TRecipeInput, id?: number): Promise<TRecipe> {
        const response = id
            ? await $fetch<{ data: TRecipe }>(`/api/recipes/${id}`, { method: 'PUT', body: input })
            : await $fetch<{ data: TRecipe }>('/api/recipes', { method: 'POST', body: input })
        return response.data
    }

    async function deleteRecipe(id: number): Promise<void> {
        await $fetch(`/api/recipes/${id}`, { method: 'DELETE' })
        recipes.value = recipes.value.filter(recipe => recipe.id !== id)
    }

    async function setFavorite(id: number, favorite: boolean): Promise<void> {
        await $fetch(`/api/recipes/${id}/favorite`, { method: 'POST', body: { favorite } })
        recipes.value = recipes.value.map(recipe => (recipe.id === id ? { ...recipe, favorite } : recipe))
    }

    // The photo as a data URL ("data:image/jpeg;base64,…"); answers its new addresses
    async function uploadImage(id: number, image: string): Promise<{ image_url: string; thumb_url: string }> {
        const response = await $fetch<{ data: { image_url: string; thumb_url: string } }>(`/api/recipes/${id}/image`, { method: 'POST', body: { image } })
        return response.data
    }

    async function deleteImage(id: number): Promise<void> {
        await $fetch(`/api/recipes/${id}/image`, { method: 'DELETE' })
    }

    return {
        recipes,
        fetchRecipes,
        fetchRecipe,
        saveRecipe,
        deleteRecipe,
        setFavorite,
        uploadImage,
        deleteImage,
    }
}
