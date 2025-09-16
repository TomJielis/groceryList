import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    const body = await readBody(event)
    const {item} = body
    try {
        const response = await apiClient('/grocery-list-item/' + item.id + '/update',
            {
                method: 'POST',
                body: { item },
            }, token);
        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }


});