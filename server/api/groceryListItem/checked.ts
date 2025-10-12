import {readBody} from 'h3'
import {getCookie} from 'h3'
import {apiClient} from "../utils/apiClient";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    const body = await readBody(event)
    const {id, checked} = body
    try {
        const response = await apiClient('/grocery-list-item/' + id + '/checked',
            {
                method: 'POST',
                'body': {id:id, checked:checked},
            }, token);

        return response;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});