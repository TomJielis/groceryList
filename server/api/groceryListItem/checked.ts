import {readBody} from 'h3'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    const body = await readBody(event)
    const {id, checked} = body
    try {
        const data = await $fetch('http://grocerylistapi.test/api/grocery-list-item/' + id + "/checked", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Assuming token is stored in context
            },
            'body': JSON.stringify({id, checked }),
        });

        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});