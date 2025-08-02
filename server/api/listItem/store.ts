import {readBody} from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {name, csrf} = body
        const response = await $fetch('http://grocerylistapi.test/api/list-item/store',
        {
            method: 'POST',
            body: JSON.stringify({name, quantity: 1}),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf, // Ensure CSRF token is included
                }
        });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
});