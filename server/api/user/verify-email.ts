import {apiClient} from "~/server/api/utils/apiClient";

type LoginResponse<T> = {
    token: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {token} = body;
    const response: LoginResponse<any> = await apiClient('/verify-email/' + token, undefined, undefined);

    if (!response.success) {
        return response;
    }

    return {
        success: true,
        message: response.message,
    };
});