import {apiClient} from "~/server/api/utils/apiClient";

// Whether a password reset link can still be used (not used yet, not expired)
export default defineEventHandler(async (event) => {
    const {token} = await readBody(event);
    try {
        const response: any = await apiClient('/check-reset-link', {method: 'POST', body: {token}}, undefined);
        return {valid: response.valid === true};
    } catch {
        // Can't tell (e.g. the API is down): let the user try; submitting gives the real answer
        return {valid: true};
    }
});
