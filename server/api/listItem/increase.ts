import {readBody} from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {id} = body
    try {
        const data = await $fetch('http://grocerylistapi.test/api/list-item/' + id + "/increase", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});