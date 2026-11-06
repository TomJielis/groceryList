// Recipes as the API sends them (RecipeController): the overview has a summary per recipe, the recipe page the whole one
export const RECIPE_CATEGORIES = ['breakfast', 'lunch', 'main', 'side', 'snack', 'dessert'] as const;
export const RECIPE_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export type TRecipeCategory = typeof RECIPE_CATEGORIES[number];
export type TRecipeDifficulty = typeof RECIPE_DIFFICULTIES[number];

export type TRecipeIngredient = {
    name: string;
    amount: number | null;
    unit: string | null;
};

export type TRecipeSummary = {
    id: number;
    cookbook_id: number;
    title: string;
    categories: TRecipeCategory[];
    servings: number;
    prep_minutes: number;
    cook_minutes: number | null;
    oven_minutes: number | null;
    oven_celsius: number | null;
    difficulty: TRecipeDifficulty;
    kcal: number | null;
    // On this website (see server/api/utils/recipeImages.ts), not the API's address
    image_url: string | null;
    thumb_url: string | null;
    favorite: boolean;
    // In a cookbook of the user's: they may change it; otherwise it's only shown to them
    editable: boolean;
    // The user's other cookbooks it's also shown in
    shown_in: number[];
    // Only the names, for searching on an ingredient
    ingredient_names: string[];
    created_at: string;
};

export type TRecipe = TRecipeSummary & {
    description: string | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    source_url: string | null;
    created_by: { id: number; name: string } | null;
    cookbook_name: string | null;
    ingredients: TRecipeIngredient[];
    steps: string[];
    updated_at: string;
};

// A user's recipes and cookbooks in numbers: "My statistics" and the admin's page about a user (API: RecipeStats)
export type TRecipeStats = {
    cookbooks_owned: number;
    cookbooks_shared_with_user: number;
    recipes_added: number;
    recipes_access: number;
    // The chosen month and the one before
    current_month: { added: number; cookbooks_created: number };
    previous_month: { added: number; cookbooks_created: number };
};

// What the form sends; the API always gets the whole recipe (RecipeRequest)
export type TRecipeInput = {
    cookbook_id: number;
    title: string;
    description: string | null;
    categories: TRecipeCategory[];
    servings: number;
    prep_minutes: number;
    cook_minutes: number | null;
    oven_minutes: number | null;
    oven_celsius: number | null;
    difficulty: TRecipeDifficulty;
    kcal: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    source_url: string | null;
    ingredients: TRecipeIngredient[];
    steps: string[];
    shown_in: number[];
};
