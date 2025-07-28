import {readBody} from 'h3'

export default defineEventHandler(async (event) => {
    // console.log('bdy?')
    // const body = await readBody(event)
    // const {name} = body
    // const response = await $fetch('http://grocerylistapi.test/list-item/store',
    //     {
    //         method: 'POST',
    //         body: JSON.stringify({name, quantity: 1}),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-Bypass-CSRF': 'true', // Bypass CSRF for API calls
    //         }
    //     })
    //
    // if (!response.ok) {
    //     throw new Error(`Failed to fetch data: ${response.statusText}`);
    // }
    //
    // const data = await response.json();
    // return data;
});