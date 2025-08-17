import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody(event)
    const {name} = body
    try {
        const response = await apiClient('/grocery-list/store',
            {
                method: 'POST',
                body: JSON.stringify({ name }),
            }, token);

        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }


});