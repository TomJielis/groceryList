import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    let body = await readBody(event);
    const {listId} = body;

    const response = await apiClient('/grocery-list-item/index',
        {
            method: 'POST',
            body: { listId:listId },
        }, token);


    return response;
});