import {apiClient} from "~/server/api/utils/apiClient";

type resetPasswordResponse<T> = {
    url: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email, password, repeatPassword, token} = body;

    const response: resetPasswordResponse<any> = await apiClient('/set-new-password', {
        method: 'POST',
        body: {email, password, repeatPassword, token},
    }, undefined);

    console.log(response);
    return {
        success: true,
    };
});