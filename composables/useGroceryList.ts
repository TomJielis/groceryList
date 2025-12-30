import {ref, computed} from 'vue'
import type { TGroceryList } from '@/types/TGroceryList'
import type { TGroceryListItem } from '@/types/TGroceryListItem'

// Shared state across all instances
// Store items per list ID to prevent conflicts when switching lists
const itemsByListId = ref<Map<number, TGroceryListItem[]>>(new Map());
const lists = ref<TGroceryList[]>([]);
const currentListId = ref<number | null>(null);

/**
 * Helper function to notify other users via Socket.io
 * Only works on client-side and when currentListId is set
 */
function notifyOtherUsers(listId: number | null, item: any): void {
    if (import.meta.client && listId !== null) {
        const { notifyItemUpdate } = useSocket();
        notifyItemUpdate(listId, item);
    }
}

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
            notifyOtherUsers(listId, newItem);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    async function clearItem(item: TGroceryListItem): Promise<void> {
        if (currentListId.value === null) return;

        // Remove from UI immediately
        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.filter((i: TGroceryListItem) => i.id !== item.id)
        );

        try {
            let route = '/api/groceryListItem/delete'
            await $fetch(route, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {id: item.id}
            });

            // Notify other users via Socket.io AFTER successful API call
            notifyOtherUsers(currentListId.value, {...item, deleted: true});
        } catch (error) {
            console.error('Error deleting item:', error);
            // Revert on error
            itemsByListId.value.set(
                currentListId.value,
                [...currentItems]
            );
        }
    }

    async function checked(updatedItem: TGroceryListItem): Promise<void> {
        if (currentListId.value === null) return;

        // Update the item in the Map FIRST for immediate UI feedback
        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((item: TGroceryListItem) =>
                item.id === updatedItem.id ? Object.assign({}, item, { checked: updatedItem.checked }) : item
            )
        );

        // Then update on server
        try {
            let route = '/api/groceryListItem/checked';
            await $fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { id: updatedItem.id, checked: updatedItem.checked }
            });

            // Notify other users via Socket.io AFTER successful API call
            notifyOtherUsers(currentListId.value, updatedItem);
        } catch (error) {
            console.error('Error updating checked status:', error);
            // Revert the optimistic update on error
            itemsByListId.value.set(
                currentListId.value,
                currentItems.map((item: TGroceryListItem) =>
                    item.id === updatedItem.id ? Object.assign({}, item, { checked: !updatedItem.checked }) : item
                )
            );
        }
    }

    async function updateItem(item: TGroceryListItem): Promise<void> {
        if (currentListId.value === null) return;

        // Update the item in the Map FIRST for immediate UI feedback
        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((i: TGroceryListItem) =>
                i.id === item.id ? { ...i, ...item } : i
            )
        );

        try {
            let route = '/api/groceryListItem/update'
            await $fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {item}
            });

            // Notify other users via Socket.io AFTER successful API call
            notifyOtherUsers(currentListId.value, item);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    async function increaseItems(item: TGroceryListItem): Promise<void> {
        if (currentListId.value === null) return;

        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        const foundItem = currentItems.find((i: TGroceryListItem) => i.id === item.id);
        if (!foundItem) return;

        // Update the item quantity in the Map FIRST for immediate UI feedback
        itemsByListId.value.set(
            currentListId.value,
            currentItems.map((i: TGroceryListItem) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );

        try {
            let route = '/api/groceryListItem/increase'
            await $fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {id: item.id}
            });

            // Notify other users via Socket.io AFTER successful API call
            notifyOtherUsers(currentListId.value, {...item, quantity: item.quantity + 1});
        } catch (error) {
            console.error('Error increasing item quantity:', error);
        }
    }

    async function decreaseItems(item: TGroceryListItem): Promise<void> {
        if (currentListId.value === null) return;

        const currentItems = itemsByListId.value.get(currentListId.value) || [];
        const foundItem = currentItems.find((i: TGroceryListItem) => i.id === item.id);
        if (!foundItem) return;

        const newQuantity = foundItem.quantity - 1;

        // Update UI immediately
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

        try {
            let route = '/api/groceryListItem/decrease'
            await $fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {id: item.id}
            });

            // Notify other users via Socket.io AFTER successful API call
            const notificationData = newQuantity < 1
                ? {...item, deleted: true}
                : {...item, quantity: newQuantity};
            notifyOtherUsers(currentListId.value, notificationData);
        } catch (error) {
            console.error('Error decreasing item quantity:', error);
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