export default defineEventHandler(async (event) => {
    const response = await fetch('http://grocerylistapi.test/api/grocery-list/index',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer 13|NagTVTDzm5QaqdQ4DWJkMHDhHX7gb48YYlqipOCqc034b991`, // Assuming token is stored in context
        },
      });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
});