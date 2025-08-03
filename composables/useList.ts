import {ref, toRaw} from 'vue'

export function useList() {
    const items = ref<any[]>( [])

    async function fetchItems() {
        try {
            const response = await fetch('/api/listItem/');
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }
          let listItems  = (await response.json()).data;
          items.value = toRaw(listItems);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    async function addItem(item: string) {
        // @ts-ignore
        const { data } = await $fetch('/api/listItem/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { name: item, quantity: 1  },
        });


        items.value.push({id: data.id, name: data.name, quantity: 1})
    }

    function clearItem(item: object){
        items.value = items.value.filter(i => i.name !== item.name)
        let route = '/api/listItem/delete'
        $fetch(route, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {id: item.id}
        });
    }

    function increaseItems(item: object) {
        const foundItem = items.value.find(i => i.id === item.id)
        foundItem.quantity += 1
    }

    function decreaseItems(item: object) {
        const foundItem = items.value.find(i => i.id === item.id)
        if(foundItem.quantity === 1){
            clearItem(item)
            return
        }
        foundItem.quantity -= 1
    }

    return {
        items,
        fetchItems,
        addItem,
        clearItem,
        increaseItems,
        decreaseItems
    }
}