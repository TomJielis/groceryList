import {ref} from 'vue'
import type { TGroceryList } from '@/types/TGroceryList'
import type { TGroceryListItem } from '@/types/TGroceryListItem'

export function useGroceryList() {
    let items = ref<TGroceryListItem[]>([]);
    let lists = ref<TGroceryList[]>([]);

    async function fetchLists() {
        try {
            const response = await fetch('/api/groceryList/');
            if (!response.ok) {
                throw new Error(`Failed to fetch lists: ${response.statusText}`);
            }
            let listResult: TGroceryList[] = (await response.json()).data;
            lists.value = listResult.map((item: TGroceryList) => ({
                ...item,
            }));
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    async function fetchPendingLists(): Promise<TGroceryList[] | undefined> {
        try {
            const response = await fetch('/api/groceryList/pending');
            if (!response.ok) {
                throw new Error(`Failed to fetch lists: ${response.statusText}`);
            }
            const result = await response.json();
            return result.data ? result.data as TGroceryList[] : result as TGroceryList[];
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    async function createList(name: string): Promise<any> {
        const response = await fetch('/api/groceryList/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name}),
        });
        if (!response.ok) {
            throw new Error(`Failed to create list: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.data) {
            throw new Error(`Failed to create list: ${response.statusText}`);
        }

       return data;
    }

    async function shareList(listId: number, email: string): Promise<void> {
        let route = '/api/groceryList/share'
        await $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: listId, email: email}
        });
    }

    async function unshareList(listId: number, userId: number): Promise<void> {
        // Endpoint to remove a shared user (invite) from a list
        await $fetch('/api/groceryList/unshare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { id: listId, userId: userId }
        });
    }

    async function favorite(id: number | null): Promise<void> {
        const response = await fetch('/api/groceryList/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });
        if (!response.ok) {
            throw new Error(`Failed to create list: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.message) {
            throw new Error(`Failed to create list: ${response.statusText}`);
        }
    }

    async function deleteList(id: number): Promise<void> {
        try {
            const response = await fetch('/api/groceryList/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id}),
            });
            if (!response.ok) {
                throw new Error(`Failed to create list: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error creating list:', error);
            throw error
        }
    }

    async function fetchItems(listId: number | null = null): Promise<void> {
        try {
            const response = await fetch('/api/groceryListItem/', {
                method: 'POST',
                body: JSON.stringify({listId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }
            let listItems: TGroceryListItem[] = (await response.json()).data;
            items.value = listItems.map((item: TGroceryListItem) => ({
                ...item,
                quantity: item.quantity || 1
            }));
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error
        }
    }

    async function addItem(item: string, listId: number): Promise<void> {
        const response = await $fetch('/api/groceryListItem/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {name: item, quantity: 1, listId: listId},
        }) as {data: TGroceryListItem};
        const newItem = response.data as TGroceryListItem;
        items.value = [...items.value, newItem];
    }

    function clearItem(item: TGroceryListItem): void {
        items.value = items.value.filter((i: TGroceryListItem) => i.name !== item.name)
        let route = '/api/groceryListItem/delete'
        $fetch(route, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    function checked(updatedItem: TGroceryListItem): void {
        let route = '/api/groceryListItem/checked';
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { id: updatedItem.id, checked: updatedItem.checked }
        });

        // Force reactivity
        items.value = items.value.map((item: TGroceryListItem) =>
            item.id === updatedItem.id ? Object.assign({}, item, { checked: updatedItem.checked }) : item
        );
    }

    function updateItem(item: TGroceryListItem): void {
        let route = '/api/groceryListItem/update'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {item}
        });
    }

    function increaseItems(item: TGroceryListItem): void {
        const foundItem = items.value.find((i: TGroceryListItem) => i.id === item.id)
        if (!foundItem) return;
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

    function decreaseItems(item: TGroceryListItem): void {
        const foundItem = items.value.find((i: TGroceryListItem) => i.id === item.id)
        if (!foundItem) return;

        foundItem.quantity -= 1

        if (foundItem.quantity < 1) {
            items.value = items.value.filter((i: TGroceryListItem) => i.name !== item.name)
        }

        let route = '/api/groceryListItem/decrease'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    async function updatePendingListStatus(id: number, status: 'accepted' | 'declined'): Promise<any> {
        return await $fetch('/api/groceryList/pending/action', {
            method: 'POST',
            body: { id, status }
        });
    }

    async function updateList(id: number, name: string): Promise<any> {
        const response = await fetch('/api/groceryList/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, name}),
        });
        if (!response.ok) {
            throw new Error(`Failed to update list: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.data) {
            throw new Error(`Failed to update list: ${response.statusText}`);
        }
        return data;
    }

    return {
        items,
        lists,
        fetchLists,
        fetchPendingLists,
        favorite,
        createList,
        shareList,
        unshareList,
        deleteList,
        fetchItems,
        addItem,
        updateItem,
        checked,
        clearItem,
        increaseItems,
        decreaseItems,
        updatePendingListStatus,
        updateList,
    }
}