import { readBody } from 'h3'
import { getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody(event)
    const { id, name } = body
    if (!id || !name) {
        throw new Error('Missing id or name for list update');
    }
    try {
        const response = await apiClient('/grocery-list/' + id +'/update', {
            method: 'POST',
            body: { id, name },
        }, token);
        return response;
    } catch (error) {
        throw new Error(`Failed to update list: ${error}`);
    }

});