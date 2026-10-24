import {apiClient} from "~/server/api/utils/apiClient";
import {forwardedForHeader} from "~/server/api/utils/visitorAddress";

type resetPasswordResponse<T> = {
    url: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email} = body;
    const response: resetPasswordResponse<any> = await apiClient('/reset-password', {
        method: 'POST',
        headers: forwardedForHeader(event),
        body: {email},
    }, undefined);

    return {
        success: true,
    };
});