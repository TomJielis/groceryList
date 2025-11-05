import {getCookie} from 'h3'
import {TGroceryList} from '~/types/TGroceryList'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const config = useRuntimeConfig();
    const baseUrl = config.api.url + config.api.basePath;
    const response = await fetch(baseUrl + '/grocery-list/pending',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`, // Assuming token is stored in context
            },
        });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: TGroceryList[] = await response.json();
    return data;
});