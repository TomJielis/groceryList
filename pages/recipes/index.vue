<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Skeleton from 'primevue/skeleton'
import deleteModal from '~/components/deleteModal.vue'
import CookbookBar from '~/components/recipes/CookbookBar.vue'
import CookbookForm from '~/components/recipes/CookbookForm.vue'
import RecipeCard from '~/components/recipes/RecipeCard.vue'
import { useCookbooks } from '~/composables/useCookbooks'
import { useRecipes } from '~/composables/useRecipes'
import { useNotification } from '~/composables/useNotification'
import { useShareLink } from '~/composables/useShareLink'
import { useI18nStore } from '~/stores/i18n'
import { useAuthStore } from '~/stores/auth'
import { RECIPE_CATEGORIES } from '~/types/TRecipe'
import type { TRecipeCategory } from '~/types/TRecipe'
import type { TCookbook } from '~/types/TCookbook'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const { cookbooks, fetchCookbooks, deleteCookbook, setFavoriteCookbook, createInviteLink } = useCookbooks()
const { recipes, fetchRecipes } = useRecipes()
const { showNotification, showSuccess } = useNotification()
const { shareLink } = useShareLink()
const i18n = useI18nStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const loadFailed = ref(false)

async function load() {
  loading.value = true
  loadFailed.value = false
  try {
    await Promise.all([fetchCookbooks(), fetchRecipes()])
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

// The cookbook shown is in the address (?cookbook=12), so a cookbook invite and the back button land on it
const selectedCookbookId = computed<number | null>({
  get: () => {
    const id = Number(route.query.cookbook)
    return cookbooks.value.some(cookbook => cookbook.id === id) ? id : null
  },
  set: (id) => router.replace({ query: id === null ? {} : { cookbook: String(id) } }),
})

// ----- Filtering: cookbook, search (title or ingredient), category, favourites -----
const search = ref('')
const category = ref<TRecipeCategory | 'all' | 'favorites'>('all')
const filterOptions = computed(() => [
  { value: 'all', label: i18n.t('recipes.allCategories') },
  { value: 'favorites', label: i18n.t('recipes.favorites') },
  ...RECIPE_CATEGORIES.map(value => ({ value, label: i18n.t(`recipes.category.${value}`) })),
])

// "Crème" is found by "creme"
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const inCookbook = computed(() => {
  const id = selectedCookbookId.value
  return id === null ? recipes.value : recipes.value.filter(recipe => recipe.cookbook_id === id || recipe.shown_in.includes(id))
})

const shownRecipes = computed(() => {
  const query = normalize(search.value.trim())
  return inCookbook.value.filter(recipe =>
    (category.value === 'all'
      || (category.value === 'favorites' ? recipe.favorite : recipe.categories.includes(category.value)))
    && (!query || [recipe.title, ...recipe.ingredient_names].some(text => normalize(text).includes(query))))
})

const filtering = computed(() => search.value.trim() !== '' || category.value !== 'all')

function newRecipe() {
  router.push({ path: '/recipes/new', query: selectedCookbookId.value ? { cookbook: String(selectedCookbookId.value) } : {} })
}

// ----- Cookbook form (instead of the recipes, like the list form on the lists page) -----
const showCookbookForm = ref(false)
const editCookbookId = ref<number | undefined>(undefined)

function openCookbookForm(cookbook?: TCookbook) {
  editCookbookId.value = cookbook?.id
  showCookbookForm.value = true
}

function closeCookbookForm() {
  showCookbookForm.value = false
  editCookbookId.value = undefined
}

function cookbookSaved(cookbook: TCookbook) {
  closeCookbookForm()
  selectedCookbookId.value = cookbook.id
}

// ----- Cookbook menu -----
async function toggleFavorite(cookbook: TCookbook) {
  try {
    await setFavoriteCookbook(cookbook.favorite ? null : cookbook.id)
    showSuccess(i18n.t('cookbooks.favoriteUpdated'))
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  }
}

// The invite link per cookbook, once made: sharing again then happens right within the tap (see useShareLink)
const inviteLinks = new Map<number, string>()

async function shareCookbook(cookbook: TCookbook) {
  let url = inviteLinks.get(cookbook.id)
  if (!url) {
    try {
      url = (await createInviteLink(cookbook.id)).url
      inviteLinks.set(cookbook.id, url)
    } catch (error: any) {
      showNotification(error?.data?.message || i18n.t('errors.inviteLinkFailed'))
      return
    }
  }
  await shareLink(url, cookbook.name, i18n.t('cookbooks.shareLinkMessage').replace('{name}', cookbook.name))
}

// Deleting (the creator, for everyone) or leaving (someone it was shared with) asks first
const cookbookToDelete = ref<TCookbook | null>(null)
const deletingOwn = computed(() => cookbookToDelete.value?.created_by?.id === auth.user?.id)

// "The cookbook and the 3 recipes in it will be deleted … 1 of them is also shown in Samen koken …"
const deleteMessage = computed(() => {
  const cookbook = cookbookToDelete.value
  if (!cookbook) return ''
  if (!deletingOwn.value) return i18n.t('cookbooks.confirmLeave')

  const count = cookbook.own_recipes_count ?? 0
  const base = count === 0 ? i18n.t('cookbooks.confirmDeleteEmpty')
    : count === 1 ? i18n.t('cookbooks.confirmDeleteOne')
      : i18n.t('cookbooks.confirmDeleteMany').replace('{count}', String(count))
  const shown = cookbook.shown_elsewhere
  if (!shown || shown.recipes === 0) return base

  const names = shown.cookbooks.length > 1
    ? `${shown.cookbooks.slice(0, -1).join(', ')} ${i18n.t('cookbooks.and')} ${shown.cookbooks.at(-1)}`
    : shown.cookbooks[0]
  const also = count === 1 ? i18n.t('cookbooks.alsoShownIt')
    : shown.recipes === 1 ? i18n.t('cookbooks.alsoShownOne')
      : i18n.t('cookbooks.alsoShownMany').replace('{count}', String(shown.recipes))
  return `${base} ${also.replace('{cookbooks}', names)}`
})

async function confirmDelete() {
  const cookbook = cookbookToDelete.value
  if (!cookbook) return
  const own = deletingOwn.value
  cookbookToDelete.value = null
  try {
    await deleteCookbook(cookbook.id)
    if (selectedCookbookId.value === cookbook.id) selectedCookbookId.value = null
    showSuccess(i18n.t(own ? 'cookbooks.deleted' : 'cookbooks.left'))
    // Its recipes are gone (or no longer visible), also where they were shown
    await fetchRecipes()
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  }
}
</script>

<template>
  <div class="recipes-shell px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-surface-200">
        <div class="space-y-1">
          <h1 class="page-heading">{{ i18n.t('recipes.title') }}</h1>
          <p class="text-sm text-surface-500">{{ inCookbook.length }} {{ i18n.t('recipes.count') }}</p>
        </div>
        <div class="flex gap-3">
          <Button
            v-if="showCookbookForm"
            icon="pi pi-times"
            :label="i18n.t('common.cancel')"
            severity="secondary"
            @click="closeCookbookForm"
          />
          <Button
            v-else-if="cookbooks.length"
            icon="pi pi-plus"
            :label="i18n.t('recipes.new')"
            severity="primary"
            @click="newRecipe"
          />
        </div>
      </div>

      <!-- Cookbook form -->
      <div v-if="showCookbookForm" class="py-4 max-w-xl">
        <CookbookForm :cookbook-id="editCookbookId" @saved="cookbookSaved" @close="closeCookbookForm" />
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="i in 8" :key="i" class="space-y-2">
          <Skeleton height="9rem" class="rounded" />
          <Skeleton height="1rem" width="70%" class="rounded" />
        </div>
      </div>

      <div v-else-if="loadFailed" class="flex flex-col items-center py-12 gap-4 text-center">
        <p class="text-sm text-surface-500">{{ i18n.t('recipes.loadFailed') }}</p>
        <Button :label="i18n.t('inviteLink.retry')" severity="secondary" outlined @click="load" />
      </div>

      <!-- No cookbook yet: recipes go into one -->
      <div v-else-if="cookbooks.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div class="text-5xl">📖</div>
        <h2 class="text-2xl font-light">{{ i18n.t('cookbooks.empty.title') }}</h2>
        <p class="text-sm text-surface-500 max-w-md">{{ i18n.t('cookbooks.empty.message') }}</p>
        <Button icon="pi pi-plus" :label="i18n.t('cookbooks.empty.button')" severity="primary" @click="openCookbookForm()" />
      </div>

      <template v-else>
        <CookbookBar
          v-model="selectedCookbookId"
          :cookbooks="cookbooks"
          @new="openCookbookForm()"
          @edit="openCookbookForm"
          @share="shareCookbook"
          @favorite="toggleFavorite"
          @delete="cookbookToDelete = $event"
        />

        <div class="flex flex-col gap-3">
          <input
            v-model="search"
            type="search"
            class="form-field"
            :placeholder="i18n.t('recipes.searchPlaceholder')"
            :aria-label="i18n.t('recipes.searchPlaceholder')"
          />
          <div class="overflow-x-auto">
            <SelectButton v-model="category" :options="filterOptions" option-label="label" option-value="value" :allow-empty="false" class="whitespace-nowrap" />
          </div>
        </div>

        <!-- Nothing in this cookbook yet -->
        <div v-if="inCookbook.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div class="text-5xl">🍳</div>
          <h2 class="text-2xl font-light">{{ i18n.t('recipes.empty.title') }}</h2>
          <p class="text-sm text-surface-500 max-w-md">{{ i18n.t('recipes.empty.message') }}</p>
          <Button icon="pi pi-plus" :label="i18n.t('recipes.addFirst')" severity="primary" @click="newRecipe" />
          <p class="text-xs text-surface-400 max-w-md">{{ i18n.t('recipes.importHint') }}</p>
        </div>

        <p v-else-if="shownRecipes.length === 0 && filtering" class="py-12 text-center text-sm text-surface-500">
          {{ i18n.t('recipes.noResults') }}
        </p>

        <div v-else class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <RecipeCard v-for="recipe in shownRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
      </template>
    </div>
  </div>

  <deleteModal
    :is-visible="cookbookToDelete !== null"
    :title="deletingOwn ? i18n.t('cookbooks.deleteTitle') : i18n.t('cookbooks.leaveTitle')"
    :content="deleteMessage"
    :item-name="cookbookToDelete?.name || ''"
    :delete-button-text="deletingOwn ? i18n.t('cookbooks.delete') : i18n.t('cookbooks.leave')"
    :with-validation="deletingOwn"
    :confirm-label="i18n.t('deleteModal.typeCookbookNameToDelete')"
    @close="cookbookToDelete = null"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.recipes-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}
</style>
