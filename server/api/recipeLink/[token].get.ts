import { apiClient } from "~/server/api/utils/apiClient";

// The recipe a recipe link shows, for the page someone without the app lands on (no login needed)
export default defineEventHandler(async (event) => {
    const token = encodeURIComponent(getRouterParam(event, 'token') || '');
    try {
        return await apiClient('/recipe-links/' + token, { method: 'GET' }, undefined);
    } catch {
        return { data: { status: 'error' } };
    }
});
