import type {TGroceryListItem} from "~/types/TGroceryListItem";
import type { TUser } from "~/types/TUser";

export type TGroceryListInvite = {
    id: number;
    user: TUser;
    created_at?: string;
    updated_at?: string;
};

export type TGroceryList = {
    id: number;
    name: string;
    created_by: TUser;
    created_at: string;
    updated_at: string;
    grocery_list_items_count: number;
    grocery_list_items_checked_count: number;
    grocery_list_items: TGroceryListItem[];
    grocery_list_invites?: TGroceryListInvite[];
}
