<script setup lang="ts">
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'
import type { TRecipeIngredient } from '~/types/TRecipe'

// The ingredients in the form: amount, unit and name per row. Rows without a name are left out when saving, and an
// emptied amount ('' from the number field) is saved as no amount (to taste), see RecipeForm.
const ingredients = defineModel<TRecipeIngredient[]>({ required: true })
const i18n = useI18nStore()

function add() {
  ingredients.value = [...ingredients.value, { name: '', amount: null, unit: null }]
}

function remove(index: number) {
  ingredients.value = ingredients.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div>
    <p class="form-label">{{ i18n.t('recipes.form.ingredients') }}</p>
    <div class="flex flex-col gap-2">
      <div
        v-for="(ingredient, index) in ingredients"
        :key="index"
        class="flex items-end gap-3"
        data-testid="ingredient-row"
      >
        <input
          v-model.number="ingredient.amount"
          type="number"
          min="0"
          step="any"
          class="form-field w-20 flex-shrink-0"
          :placeholder="i18n.t('recipes.form.amount')"
          :aria-label="i18n.t('recipes.form.amount')"
        />
        <input
          v-model="ingredient.unit"
          type="text"
          maxlength="30"
          class="form-field w-24 flex-shrink-0"
          :placeholder="i18n.t('recipes.form.unit')"
          :aria-label="i18n.t('recipes.form.unit')"
        />
        <input
          v-model="ingredient.name"
          type="text"
          maxlength="255"
          class="form-field flex-1 min-w-0"
          :placeholder="i18n.t('recipes.form.ingredientName')"
          :aria-label="i18n.t('recipes.form.ingredientName')"
        />
        <Button icon="pi pi-times" severity="secondary" text :aria-label="i18n.t('recipes.form.remove')" @click="remove(index)" />
      </div>
    </div>
    <Button
      class="mt-3"
      icon="pi pi-plus"
      severity="secondary"
      text
      :label="i18n.t('recipes.form.addIngredient')"
      @click="add"
    />
  </div>
</template>
