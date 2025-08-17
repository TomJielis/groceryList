import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    const body = await readBody(event)
    const {name, listId} = body
    try {
        const response = await apiClient('/grocery-list-item/store',
            {
                method: 'POST',
                body: { name:name, quantity: 1, list_id: listId },
            }, token);
        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }


});