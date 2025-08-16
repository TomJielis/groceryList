import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    // const authStore = useAuthStore();
    const token = getCookie(event, 'token')

    // console.log(`dit is mijn token ${authStore.token}`);
    const response = await fetch('http://grocerylistapi.test/api/grocery-list/index',
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

    const data = await response.json();
    return data;
});