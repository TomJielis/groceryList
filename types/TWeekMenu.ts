import type { TRecipeIngredient } from '~/types/TRecipe'

// A week menu the user is in (the API's WeekMenuController::present)
export type TWeekMenu = {
    id: number
    name: string
    created_by: { id: number; name: string } | null
    is_owner: boolean
    // Everyone besides the creator
    members: { id: number; name: string }[]
    created_at: string
}

// A recipe planned on a day (WeekMenuController::presentEntry)
export type TWeekMenuEntry = {
    id: number
    // YYYY-MM-DD, the same calendar day for everyone in the menu
    date: string
    servings: number
    position: number
    added_by: { id: number; name: string } | null
    // When its ingredients were put on a list, by whom and on which list (null: not yet)
    added_to_list_at: string | null
    added_to_list_by?: { id: number; name: string } | null
    added_to_list?: { id: number; name: string } | null
    // For how many servings it went on the list ("servings changed" when that's not the number now)
    added_to_list_servings?: number | null
    recipe: {
        id: number
        title: string
        // The recipe's own number of servings: the ingredients are for that many
        servings: number
        image_url: string | null
        thumb_url: string | null
        prep_minutes: number | null
        cook_minutes: number | null
        ingredients: TRecipeIngredient[]
    }
}
