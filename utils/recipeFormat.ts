import type { TRecipeIngredient } from '~/types/TRecipe'

type WithTimes = { prep_minutes: number; cook_minutes: number | null; oven_minutes: number | null }

// Prep, cooking and oven time together, as the recipe tiles and pages show it
export function totalMinutes(recipe: WithTimes): number {
    return recipe.prep_minutes + (recipe.cook_minutes ?? 0) + (recipe.oven_minutes ?? 0)
}

// "1,5" in Dutch, "1.5" in English; at most one decimal, so 200 g for 3 people doesn't become 66.666 g
export function formatAmount(amount: number, locale: string): string {
    return String(Math.round(amount * 10) / 10).replace('.', locale === 'nl' ? ',' : '.')
}

// "1,5 el olijfolie"; `factor` scales the amount to another number of servings
export function ingredientText(ingredient: TRecipeIngredient, locale: string, factor = 1): string {
    const amount = ingredient.amount === null ? '' : formatAmount(ingredient.amount * factor, locale)
    return [amount, ingredient.unit, ingredient.name].filter(Boolean).join(' ')
}
