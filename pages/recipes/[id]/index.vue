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
import { useCookbooks } from '~/composables/useCookbooks'
import { useWeekMenu } from '~/composables/useWeekMenu'
import { useSocket } from '~/composables/useSocket'
import Dialog from 'primevue/dialog'
import { addDays, dayLabel, mondayOf, toDateKey } from '~/utils/weekMenu'
import { useAuthStore } from '~/stores/auth'
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
    // Opened from the week menu: for the number of servings it's planned for
    const planned = Number(route.query.servings)
    servings.value = Number.isInteger(planned) && planned > 0 && planned <= 99 ? planned : recipe.value.servings
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

// Only seen through a week menu (someone else's recipe): an own copy can go into the user's cookbook
const onlyInWeekMenu = computed(() => recipe.value?.in_recipe_book === false)
const { cookbooks, fetchCookbooks } = useCookbooks()
const auth = useAuthStore()
const savingCopy = ref(false)

async function saveCopy() {
  if (!recipe.value || savingCopy.value) return
  savingCopy.value = true
  try {
    if (cookbooks.value.length === 0) await fetchCookbooks()
    // The favourite cookbook, else the user's own, else the first
    const cookbook = cookbooks.value.find(c => c.favorite)
      ?? cookbooks.value.find(c => String(c.created_by?.id) === String(auth.user?.id))
      ?? cookbooks.value[0]
    if (!cookbook) {
      showNotification(i18n.t('recipes.saveCopyNoCookbook'))
      return
    }
    const copy = await $fetch<{ data: { id: number } }>(`/api/recipes/${recipe.value.id}/copy`, { method: 'POST', body: { cookbookId: cookbook.id } })
    showSuccess(i18n.t('recipes.saveCopyDone'))
    router.replace(`/recipes/${copy.data.id}`)
  } catch (error: any) {
    // Saved before: to that copy (or the recipe in a cookbook of theirs)
    const existing = error?.statusCode === 409 ? error?.data?.data?.recipe_id : null
    showNotification(i18n.t(error?.statusCode === 409 ? 'recipes.saveCopyAlready' : 'recipes.saveCopyFailed'))
    if (existing) router.replace(`/recipes/${existing}`)
  } finally {
    savingCopy.value = false
  }
}

// ----- "Plan": this recipe on a day of a week menu (this week or next) -----
const weekMenu = useWeekMenu()
const planOpen = ref(false)
const planMenuId = ref<number | null>(null)
const planBusy = ref(false)
const planDays = computed(() => Array.from({ length: 14 }, (_, index) => addDays(mondayOf(new Date()), index)))
const todayKey = toDateKey(new Date())

async function openPlan() {
  planOpen.value = true
  try {
    await weekMenu.fetchMenus()
  } catch {
    showNotification(i18n.t('weekMenu.loadFailed'))
  }
  planMenuId.value = planMenuId.value ?? weekMenu.menus.value[0]?.id ?? null
}
async function planOn(day: Date) {
  if (!recipe.value || planMenuId.value === null || planBusy.value) return
  planBusy.value = true
  try {
    const remembered = Number(localStorage.getItem(`weekMenuServings:${planMenuId.value}`))
    await weekMenu.plan(planMenuId.value, toDateKey(day), recipe.value.id, remembered > 0 ? remembered : undefined)
    // The others in the menu see it right away
    useSocket().notifyWeekMenuUpdate(planMenuId.value)
    planOpen.value = false
    showSuccess(i18n.t('weekMenu.planned').split('{title}').join(recipe.value.title).split('{day}').join(dayLabel(day, i18n.locale)))
  } catch {
    showNotification(i18n.t('weekMenu.planFailed'))
  } finally {
    planBusy.value = false
  }
}

// Opened from the week menu: back goes there again
const backTo = computed(() => (route.query.from === 'week-menu' ? '/recipes/week-menu' : '/recipes'))

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
        <PageHeader :back-to="backTo" :title="i18n.t('recipes.title')" />
        <p class="py-12 text-center text-sm text-surface-500">{{ i18n.t('recipes.notFound') }}</p>
      </template>

      <template v-else>
        <PageHeader :back-to="backTo" :title="recipe.title" :subtitle="subtitle">
          <template #actions>
            <div class="flex flex-wrap gap-2">
              <Button
                v-if="onlyInWeekMenu"
                icon="pi pi-bookmark"
                :label="i18n.t('recipes.saveCopy')"
                severity="secondary"
                outlined
                :loading="savingCopy"
                data-testid="recipe-save-copy"
                @click="saveCopy"
              />
              <!-- Planning takes a recipe from your own recipe book -->
              <Button
                v-if="!onlyInWeekMenu"
                icon="pi pi-calendar-plus"
                :label="i18n.t('weekMenu.plan')"
                severity="secondary"
                outlined
                data-testid="recipe-plan"
                @click="openPlan"
              />
              <!-- A favourite is one of your own recipes: not for one you only see through a week menu -->
              <Button
                v-if="!onlyInWeekMenu"
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

        <p v-if="onlyInWeekMenu" class="text-sm rounded bg-surface-100 px-3 py-2" data-testid="recipe-week-menu-only">
          {{ i18n.t('recipes.saveCopyHint') }}
        </p>

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

  <Dialog v-model:visible="planOpen" modal :header="i18n.t('weekMenu.planTitle')" :style="{ width: '30rem', maxWidth: '90vw' }">
    <template v-if="weekMenu.loaded.value && weekMenu.menus.value.length === 0">
      <p class="text-sm text-surface-600 mb-4">{{ i18n.t('weekMenu.planNoMenu') }}</p>
      <Button :label="i18n.t('weekMenu.toWeekMenu')" icon="pi pi-calendar" @click="router.push('/recipes/week-menu')" />
    </template>
    <template v-else>
      <template v-if="weekMenu.menus.value.length > 1">
        <p class="mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.planWhichMenu') }}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <Button v-for="option in weekMenu.menus.value" :key="option.id" :label="option.name" size="small" rounded
            :severity="option.id === planMenuId ? undefined : 'secondary'" :outlined="option.id !== planMenuId"
            :aria-pressed="option.id === planMenuId" @click="planMenuId = option.id" />
        </div>
      </template>
      <p class="mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.planWhichDay') }}</p>
      <div class="grid grid-cols-7 gap-2">
        <button
          v-for="day in planDays"
          :key="toDateKey(day)"
          class="plan-day"
          :class="{ 'is-today': toDateKey(day) === todayKey, 'is-past': toDateKey(day) < todayKey }"
          :disabled="planBusy || planMenuId === null"
          :data-testid="`recipe-plan-${toDateKey(day)}`"
          @click="planOn(day)"
        >
          <span class="text-[11px] text-surface-500">{{ dayLabel(day, i18n.locale).split(' ')[0] }}</span>
          <span class="text-base font-semibold">{{ day.getDate() }}</span>
        </button>
      </div>
    </template>
  </Dialog>

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
.plan-day {
  display: flex; flex-direction: column; align-items: center; padding: 6px 0; border-radius: 10px;
  border: 1px solid var(--p-surface-200); transition: border-color 0.15s, background 0.15s;
}
.plan-day:hover:not(:disabled) { border-color: #5ebd8a; background: rgba(94, 189, 138, 0.08); }
.plan-day.is-today { border-color: #5ebd8a; color: #3f9a6b; }
.plan-day.is-past { opacity: 0.45; }
.recipe-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}
</style>
