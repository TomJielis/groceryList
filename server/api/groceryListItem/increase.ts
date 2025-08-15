import {readBody} from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {id} = body
    try {
        const data = await $fetch('http://grocerylistapi.test/api/grocery-list-item/' + id + "/increase", {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer 13|NagTVTDzm5QaqdQ4DWJkMHDhHX7gb48YYlqipOCqc034b991`, // Assuming token is stored in context
            },
        });

        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
});