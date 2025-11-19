import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    try {
        const response = await apiClient('/me',
            {
                method: 'POST',
            }, token);
        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});