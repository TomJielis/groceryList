import {apiClient} from '~/server/api/utils/apiClient'

type resetPasswordResponse<T> = {
    url: string;
};
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    const {email} = body;
    const response: resetPasswordResponse<any> = await apiClient('/reset-password', {
        method: 'POST',
        body: {email},
    }, undefined);

    console.log(response);
    return {
        success: true,
    };
});