import {ref} from 'vue'

export function useGroceryList() {
    let items = ref([]);
    let lists = ref([]);


    async function fetchLists() {
        try {
            const response = await fetch('/api/groceryList/');
            if (!response.ok) {
                throw new Error(`Failed to fetch lists: ${response.statusText}`);
            }
            let listResult = (await response.json()).data;
            lists.value = listResult.map(item => ({
                ...item,
            }));
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    async function createList(name: string) {
        try {
            const response = await fetch('/api/groceryList/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error(`Failed to create list: ${response.statusText}`);
            }
            const data = await response.json();
            lists.value.push(data);
        } catch (error) {
            console.error('Error creating list:', error);
        }
    }



    async function fetchItems(listId : number | null = null) {
        try {
            const response = await fetch('/api/groceryListItem/', {
                method: 'POST',
                body: JSON.stringify({ listId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }
            let listItems = (await response.json()).data;
            items.value = listItems.map(item => ({
                ...item,
                quantity: item.quantity || 1
            }));
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    async function addItem(item: string, listId: string) {
        const { data } = await $fetch('/api/groceryListItem/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { name: item, quantity: 1, listId: listId },
        });
        items.value = [...items.value, data];
    }

    function clearItem(item: object){
        items.value = items.value.filter(i => i.name !== item.name)
        let route = '/api/groceryListItem/delete'
        $fetch(route, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    function checked(item: object) {
        let route = '/api/groceryListItem/checked'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id, checked:item.checked}
        });
    }

    function increaseItems(item: object) {
        const foundItem = items.value.find(i => i.id === item.id)
        foundItem.quantity += 1
        let route = '/api/groceryListItem/increase'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    function decreaseItems(item: object) {
        const foundItem = items.value.find(i => i.id === item.id)
        if(foundItem.quantity === 1){
            clearItem(item)
            return
        }
        foundItem.quantity -= 1

        let route = '/api/groceryListItem/decrease'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    return {
        items,
        lists,
        fetchLists,
        createList,
        fetchItems,
        addItem,
        checked,
        clearItem,
        increaseItems,
        decreaseItems
    }
}