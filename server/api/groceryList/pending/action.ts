import {defineEventHandler, getCookie, readBody} from 'h3';
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {id, status} = body;
    const token = getCookie(event, 'token')

    try {
        const response = await apiClient('/grocery-list/pending/update-status',
            {
                method: 'POST',
                body: {id: id, status: status},
            }, token);

        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});

