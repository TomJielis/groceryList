<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import SelectButton from 'primevue/selectbutton'
import RecipePhotoField from '~/components/recipes/RecipePhotoField.vue'
import RecipeIngredientsEditor from '~/components/recipes/RecipeIngredientsEditor.vue'
import RecipeStepsEditor from '~/components/recipes/RecipeStepsEditor.vue'
import { useCookbooks } from '~/composables/useCookbooks'
import { useRecipes } from '~/composables/useRecipes'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'
import { RECIPE_CATEGORIES, RECIPE_DIFFICULTIES } from '~/types/TRecipe'
import type { TRecipe, TRecipeInput } from '~/types/TRecipe'

// A new recipe (without `recipe`) or changing one, with everything the app's form has except importing from a link.
// The API checks the fields and answers its own message, which is shown as is.
const props = defineProps<{
  recipe?: TRecipe
  // For a new recipe: the cookbook it goes into, unless the user picks another
  cookbookId?: number | null
}>()
const emit = defineEmits<{
  (e: 'saved', recipe: TRecipe): void
  (e: 'cancel'): void
}>()

const { cookbooks } = useCookbooks()
const { saveRecipe, uploadImage, deleteImage } = useRecipes()
const { showNotification, showSuccess } = useNotification()
const i18n = useI18nStore()

const defaultCookbookId = props.cookbookId
  ?? cookbooks.value.find(cookbook => cookbook.favorite)?.id
  ?? cookbooks.value[0]?.id

// Number fields hold '' once emptied; toInput() turns that into "none"
const form = reactive({
  cookbook_id: props.recipe?.cookbook_id ?? defaultCookbookId,
  shown_in: [...(props.recipe?.shown_in ?? [])],
  title: props.recipe?.title ?? '',
  description: props.recipe?.description ?? '',
  categories: [...(props.recipe?.categories ?? [])],
  servings: props.recipe?.servings ?? 4,
  prep_minutes: props.recipe?.prep_minutes ?? 0,
  cook_minutes: props.recipe?.cook_minutes ?? null,
  oven_minutes: props.recipe?.oven_minutes ?? null,
  oven_celsius: props.recipe?.oven_celsius ?? null,
  difficulty: props.recipe?.difficulty ?? 'easy',
  kcal: props.recipe?.kcal ?? null,
  protein: props.recipe?.protein ?? null,
  carbs: props.recipe?.carbs ?? null,
  fat: props.recipe?.fat ?? null,
  source_url: props.recipe?.source_url ?? '',
  ingredients: props.recipe?.ingredients.map(ingredient => ({ ...ingredient })) ?? [{ name: '', amount: null, unit: null }],
  steps: [...(props.recipe?.steps ?? [''])],
})
// undefined: the photo stays; a data URL: a new one; null: removed (see RecipePhotoField)
const photoChange = ref<string | null | undefined>(undefined)
const saving = ref(false)

const categoryOptions = computed(() => RECIPE_CATEGORIES.map(value => ({ value, label: i18n.t(`recipes.category.${value}`) })))
const difficultyOptions = computed(() => RECIPE_DIFFICULTIES.map(value => ({ value, label: i18n.t(`recipes.difficulty.${value}`) })))
// The user's other cookbooks it can also be shown in (read-only there)
const otherCookbooks = computed(() => cookbooks.value.filter(cookbook => cookbook.id !== form.cookbook_id))

const canSave = computed(() => Boolean(form.title.trim() && form.cookbook_id) && !saving.value)

const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null)
const text = (value: string | null): string | null => value?.trim() || null

function toInput(): TRecipeInput {
  return {
    cookbook_id: form.cookbook_id!,
    title: form.title.trim(),
    description: text(form.description),
    categories: form.categories,
    servings: whole(form.servings) ?? 1,
    prep_minutes: whole(form.prep_minutes) ?? 0,
    cook_minutes: whole(form.cook_minutes),
    oven_minutes: whole(form.oven_minutes),
    oven_celsius: whole(form.oven_celsius),
    difficulty: form.difficulty,
    kcal: whole(form.kcal),
    protein: whole(form.protein),
    carbs: whole(form.carbs),
    fat: whole(form.fat),
    source_url: text(form.source_url),
    ingredients: form.ingredients
      .filter(ingredient => ingredient.name.trim())
      .map(ingredient => ({
        name: ingredient.name.trim(),
        amount: typeof ingredient.amount === 'number' ? ingredient.amount : null,
        unit: text(ingredient.unit),
      })),
    steps: form.steps.map(step => step.trim()).filter(Boolean),
    shown_in: form.shown_in.filter(id => id !== form.cookbook_id),
  }
}

async function save() {
  if (!canSave.value) return
  saving.value = true
  let saved: TRecipe
  try {
    saved = await saveRecipe(toInput(), props.recipe?.id)
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('recipes.form.saveFailed'), 'error', 4000)
    saving.value = false
    return
  }

  // The photo only once the recipe exists; the recipe stays saved if the photo fails
  try {
    if (typeof photoChange.value === 'string') {
      saved = { ...saved, ...(await uploadImage(saved.id, photoChange.value)) }
    } else if (photoChange.value === null && props.recipe?.image_url) {
      await deleteImage(saved.id)
      saved = { ...saved, image_url: null, thumb_url: null }
    }
    showSuccess(i18n.t(props.recipe ? 'recipes.saved' : 'recipes.created'))
  } catch {
    showNotification(i18n.t('recipes.form.photoFailed'), 'error', 4000)
  }
  saving.value = false
  emit('saved', saved)
}
</script>

<template>
  <form class="flex flex-col gap-8" @submit.prevent="save">
    <p class="text-sm text-surface-500">{{ i18n.t('recipes.importHint') }}</p>

    <RecipePhotoField v-model="photoChange" :current-url="recipe?.image_url ?? null" />

    <div class="grid gap-6 md:grid-cols-2">
      <div class="md:col-span-2">
        <label class="form-label" for="recipe-title">{{ i18n.t('recipes.form.title') }}</label>
        <input
          id="recipe-title"
          v-model="form.title"
          type="text"
          maxlength="255"
          required
          class="form-field font-medium"
          :placeholder="i18n.t('recipes.form.titlePlaceholder')"
        />
      </div>

      <div>
        <label class="form-label" for="recipe-cookbook">{{ i18n.t('recipes.form.cookbook') }}</label>
        <select id="recipe-cookbook" v-model="form.cookbook_id" class="form-field cursor-pointer">
          <option v-for="cookbook in cookbooks" :key="cookbook.id" :value="cookbook.id">{{ cookbook.name }}</option>
        </select>
      </div>

      <div v-if="otherCookbooks.length">
        <p class="form-label">{{ i18n.t('recipes.form.shownIn') }}</p>
        <div class="flex flex-col gap-2 pt-1">
          <label v-for="cookbook in otherCookbooks" :key="cookbook.id" class="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox v-model="form.shown_in" :value="cookbook.id" />
            {{ cookbook.name }}
          </label>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="form-label" for="recipe-description">{{ i18n.t('recipes.form.description') }}</label>
        <textarea
          id="recipe-description"
          v-model="form.description"
          rows="2"
          maxlength="5000"
          class="form-field resize-y"
          :placeholder="i18n.t('recipes.form.descriptionPlaceholder')"
        ></textarea>
      </div>

      <div class="md:col-span-2">
        <p class="form-label">{{ i18n.t('recipes.form.categories') }}</p>
        <SelectButton v-model="form.categories" :options="categoryOptions" option-label="label" option-value="value" multiple />
      </div>
    </div>

    <div class="grid gap-6 grid-cols-2 md:grid-cols-5">
      <div>
        <label class="form-label" for="recipe-servings">{{ i18n.t('recipes.form.servings') }}</label>
        <input id="recipe-servings" v-model.number="form.servings" type="number" min="1" max="100" required class="form-field" />
      </div>
      <div>
        <label class="form-label" for="recipe-prep">{{ i18n.t('recipes.form.prep') }}</label>
        <input id="recipe-prep" v-model.number="form.prep_minutes" type="number" min="0" max="1440" class="form-field" />
      </div>
      <div>
        <label class="form-label" for="recipe-cook">{{ i18n.t('recipes.form.cook') }}</label>
        <input id="recipe-cook" v-model.number="form.cook_minutes" type="number" min="0" max="1440" class="form-field" />
      </div>
      <div>
        <label class="form-label" for="recipe-oven">{{ i18n.t('recipes.form.oven') }}</label>
        <input id="recipe-oven" v-model.number="form.oven_minutes" type="number" min="0" max="1440" class="form-field" />
      </div>
      <div>
        <label class="form-label" for="recipe-oven-temp">{{ i18n.t('recipes.form.ovenTemp') }}</label>
        <input id="recipe-oven-temp" v-model.number="form.oven_celsius" type="number" min="30" max="300" class="form-field" />
      </div>
    </div>

    <div>
      <p class="form-label">{{ i18n.t('recipes.form.difficulty') }}</p>
      <SelectButton v-model="form.difficulty" :options="difficultyOptions" option-label="label" option-value="value" :allow-empty="false" />
    </div>

    <RecipeIngredientsEditor v-model="form.ingredients" />

    <RecipeStepsEditor v-model="form.steps" />

    <div>
      <p class="form-label">{{ i18n.t('recipes.form.nutrition') }}</p>
      <div class="grid gap-6 grid-cols-2 md:grid-cols-4">
        <input v-model.number="form.kcal" type="number" min="0" max="10000" class="form-field" :placeholder="i18n.t('recipes.form.kcal')" :aria-label="i18n.t('recipes.form.kcal')" />
        <input v-model.number="form.protein" type="number" min="0" max="1000" class="form-field" :placeholder="i18n.t('recipes.form.protein')" :aria-label="i18n.t('recipes.form.protein')" />
        <input v-model.number="form.carbs" type="number" min="0" max="1000" class="form-field" :placeholder="i18n.t('recipes.form.carbs')" :aria-label="i18n.t('recipes.form.carbs')" />
        <input v-model.number="form.fat" type="number" min="0" max="1000" class="form-field" :placeholder="i18n.t('recipes.form.fat')" :aria-label="i18n.t('recipes.form.fat')" />
      </div>
    </div>

    <div>
      <label class="form-label" for="recipe-source">{{ i18n.t('recipes.form.source') }}</label>
      <input id="recipe-source" v-model="form.source_url" type="url" maxlength="2048" class="form-field" placeholder="https://" />
    </div>

    <div class="flex gap-2 pt-2">
      <Button type="button" severity="secondary" outlined class="flex-1" :label="i18n.t('common.cancel')" @click="emit('cancel')" />
      <Button
        type="submit"
        severity="primary"
        class="flex-1"
        :label="recipe ? i18n.t('recipes.form.save') : i18n.t('recipes.form.create')"
        :disabled="!canSave"
        :loading="saving"
      />
    </div>
  </form>
</template>
