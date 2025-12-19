import { getCookie } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const config = useRuntimeConfig()
    try {
        const response = await apiClient('/approve-terms',
            {
                method: 'POST',
                body: { acceptedTermsVersion: config.public.termsVersion }
            }, token);
        return response;
    } catch (error) {
        throw new Error(`Failed to approve terms: ${error}`);
    }
});