import {ref, computed} from 'vue'
import type { TGroceryList } from '@/types/TGroceryList'
import type { TGroceryListItem } from '@/types/TGroceryListItem'

// Shared state across all instances
// Store items per list ID to prevent conflicts when switching lists
const itemsByListId = ref<Map<number, TGroceryListItem[]>>(new Map());
const lists = ref<TGroceryList[]>([]);
const currentListId = ref<number | null>(null);

export function useGroceryList() {

    // Computed items for the current list
    const items = computed(() => {
        if (currentListId.value === null) return [];
        return itemsByListId.value.get(currentListId.value) || [];
    });

    // Computed total price for unchecked items in the current list
    const totalPrice = computed(() => {
        return items.value
            .filter((item: TGroceryListItem) => !item.checked)
            .reduce((total: number, item: TGroceryListItem) => {
                return total + ((item.unit_price || 0) * (item.quantity || 1));
            }, 0);
    });

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
        try {
            let route = '/api/groceryList/share'
            await $fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {id: listId, email: email}
            });
        } catch (error) {
            console.error('Error sharing list:', error);
            throw error;
        }
    }

    async function unshareList(listId: number, userId: number): Promise<void> {
        try {
            // Endpoint to remove a shared user (invite) from a list
            await $fetch('/api/groceryList/unshare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: listId, userId: userId }
            });
        } catch (error) {
            console.error('Error unsharing list:', error);
            throw error;
        }
    }

    async function favorite(id: number | null): Promise<void> {
        try {
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
        } catch (error) {
            console.error('Error favoriting list:', error);
            throw error;
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
            const processedItems = listItems.map((item: TGroceryListItem) => ({
                ...item,
                quantity: item.quantity || 1
            }));

            // Store items for this specific list
            if (listId !== null) {
                currentListId.value = listId;
                itemsByListId.value.set(listId, processedItems);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    async function addItem(item: string, listId: number): Promise<void> {
        try {
            const response = await $fetch('/api/groceryListItem/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {name: item, quantity: 1, listId: listId},
            }) as {data: TGroceryListItem};
            const newItem = response.data as TGroceryListItem;

            // Add to the specific list's items
            const currentItems = itemsByListId.value.get(listId) || [];
            itemsByListId.value.set(listId, [...currentItems, newItem]);

            // Notify other users via Socket.io
            if (process.client) {
                const { notifyItemUpdate } = useSocket();
                notifyItemUpdate(listId, newItem);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    function clearItem(item: TGroceryListItem): void {
        if (currentListId.value === null) return;

        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.filter((i: TGroceryListItem) => i.name !== item.name)
        );

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

        if (currentListId.value === null) return;

        // Update the item in the Map
        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((item: TGroceryListItem) =>
                item.id === updatedItem.id ? Object.assign({}, item, { checked: updatedItem.checked }) : item
            )
        );

        // Notify other users via Socket.io
        if (process.client && currentListId.value) {
            const { notifyItemUpdate } = useSocket();
            notifyItemUpdate(currentListId.value, updatedItem);
        }
    }

    function updateItem(item: TGroceryListItem): void {
        if (currentListId.value === null) return;

        // Update the item in the Map
        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((i: TGroceryListItem) =>
                i.id === item.id ? { ...i, ...item } : i
            )
        );

        let route = '/api/groceryListItem/update'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {item}
        });

        // Notify other users via Socket.io
        if (process.client && currentListId.value) {
            const { notifyItemUpdate } = useSocket();
            notifyItemUpdate(currentListId.value, item);
        }
    }

    function increaseItems(item: TGroceryListItem): void {
        if (currentListId.value === null) return;

        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        const foundItem = currentItems.find((i: TGroceryListItem) => i.id === item.id);
        if (!foundItem) return;

        // Update the item quantity in the Map
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((i: TGroceryListItem) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );

        let route = '/api/groceryListItem/increase'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });

        // Notify other users via Socket.io
        if (process.client && currentListId.value) {
            const { notifyItemUpdate } = useSocket();
            notifyItemUpdate(currentListId.value, {...item, quantity: item.quantity + 1});
        }
    }

    function decreaseItems(item: TGroceryListItem): void {
        if (currentListId.value === null) return;

        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        const foundItem = currentItems.find((i: TGroceryListItem) => i.id === item.id);
        if (!foundItem) return;

        const newQuantity = foundItem.quantity - 1;

        if (newQuantity < 1) {
            // Remove item from the Map
            itemsByListId.value.set(
                currentListId.value,
                currentItems.filter((i: TGroceryListItem) => i.id !== item.id)
            );
        } else {
            // Update quantity in the Map
            itemsByListId.value.set(
                currentListId.value,
                currentItems.map((i: TGroceryListItem) =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                )
            );
        }

        let route = '/api/groceryListItem/decrease'
        $fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });

        // Notify other users via Socket.io
        if (process.client && currentListId.value) {
            const { notifyItemUpdate } = useSocket();
            if (newQuantity < 1) {
                notifyItemUpdate(currentListId.value, {...item, deleted: true});
            } else {
                notifyItemUpdate(currentListId.value, {...item, quantity: newQuantity});
            }
        }
    }

    async function updatePendingListStatus(id: number, status: 'accepted' | 'declined'): Promise<any> {
        try {
            return await $fetch('/api/groceryList/pending/action', {
                method: 'POST',
                body: { id, status }
            });
        } catch (error) {
            console.error('Error updating pending list status:', error);
            throw error;
        }
    }

    async function updateList(id: number, name: string): Promise<any> {
        try {
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
        } catch (error) {
            console.error('Error updating list:', error);
            throw error;
        }
    }

    return {
        items,
        lists,
        totalPrice,
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