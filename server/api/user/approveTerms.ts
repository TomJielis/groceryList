import { getCookie, getHeader } from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
    // Try to get token from cookies first (standard), then from Authorization header (Safari PWA fallback)
    let token = getCookie(event, 'token')

    if (!token) {
        const authHeader = getHeader(event, 'authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7) // Remove 'Bearer ' prefix
        }
    }

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