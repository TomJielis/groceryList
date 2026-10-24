import {apiClient} from "~/server/api/utils/apiClient";

type resetPasswordResponse<T> = {
    url: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password, repeatPassword, token} = body;

    try {
        await apiClient('/set-new-password', {
            method: 'POST',
            body: {email, password, repeatPassword, token},
        }, undefined);
    } catch (error: any) {
        // e.g. invalid_link when the link was used before, so the page can say so
        return {
            success: false,
            reason: error?.data?.reason ?? 'unknown',
        };
    }

    return {
        success: true,
    };
});