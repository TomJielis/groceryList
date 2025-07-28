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
        const { data, error } = await useFetch('/api/listItem/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: { name: item, quantity: 1, csrf_token: localStorage.getItem('csrfToken') || '' },
        });


        items.value.push({name: item, quantity: 1})
    }

    function removeItem(item: string) {

        items.value = items.value.filter(i => i.name !== item)
    }

    function clearItems() {
        items.value = []
    }

    function clearItem(item: string){
        items.value = items.value.filter(i => i.name !== item)
    }

    function increaseItems(item: string) {
        const foundItem = items.value.find(i => i.name === item)
        foundItem.quantity += 1
    }

    function decreaseItems(item: string) {
        const foundItem = items.value.find(i => i.name === item)

        if(foundItem.quantity <= 1){
            removeItem(item)
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