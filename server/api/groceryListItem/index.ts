import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')

    let body = await readBody(event);
    const {listId} = body;

    const response = await fetch('http://grocerylistapi.test/api/grocery-list-item/index', {
        method: 'POST',
        body: JSON.stringify({ listId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Assuming token is stored in context

        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
});