import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody(event)
    const {id, email} = body
    try {
        console.log(id, email)
        const response = await apiClient('/grocery-list/share',
            {
                method: 'POST',
                body: { groceryListId:id, email:email },
            }, token);

        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }


});