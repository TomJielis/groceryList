import {readBody} from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {name} = body
    try {
        const data = await $fetch('http://grocerylistapi.test/api/grocery-list/store', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }


});