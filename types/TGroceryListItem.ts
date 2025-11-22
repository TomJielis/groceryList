// ~/types/user.ts
export type TGroceryListItem = {
    id: number;
    name: string;
    quantity: number;
    unit_price?: number;
    list_id: number;
    checked: number;
    created_at: string;
    updated_at: string;
}
