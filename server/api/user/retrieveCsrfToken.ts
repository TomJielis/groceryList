export default defineEventHandler(async (event) => {
    const response = await $fetch('http://grocerylistapi.test/create-csrf-token');

    return await response;
});