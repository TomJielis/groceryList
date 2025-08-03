export default defineEventHandler(async (event) => {
    const response = await fetch('http://grocerylistapi.test/api/grocery-list-item/index');

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
});