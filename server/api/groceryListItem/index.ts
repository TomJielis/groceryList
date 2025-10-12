import { getCookie } from 'h3'
import {apiClient} from "../utils/apiClient";
import {TGroceryListItem} from "~/types/TGroceryListItem";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    let body = await readBody(event);
    const {listId} = body;

    const response = await apiClient('/grocery-list-item/index',
        {
            method: 'POST',
            body: { listId:listId },
        }, token);

    return response as unknown as TGroceryListItem[];
});