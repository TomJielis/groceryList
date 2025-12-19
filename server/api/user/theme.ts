import { readBody, getCookie } from 'h3'
import { apiClient } from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const body = await readBody(event)

    try {
        const response = await apiClient('/update-theme', {
            method: 'POST',
            body: { darkMode: body },
        }, token);

        return response;
    } catch (error) {
        throw new Error(`Failed to update theme preference: ${error}`);
    }
});

