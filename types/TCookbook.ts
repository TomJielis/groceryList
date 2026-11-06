// Cookbooks as the API sends them (CookbookController)
export type TCookbookMember = {
    id: number;
    name: string;
};

export type TCookbook = {
    id: number;
    name: string;
    // The cookbook new recipes go into from "All recipes"
    favorite: boolean;
    created_by: TCookbookMember | null;
    // Its own recipes and the ones of other cookbooks shown in it
    recipes_count: number;
    // Only for the creator, who deletes it: its own recipes, and how many of them other cookbooks show (and which)
    own_recipes_count: number | null;
    shown_elsewhere: { recipes: number; cookbooks: string[] } | null;
    // The creator first, then who joined
    members: TCookbookMember[];
};
