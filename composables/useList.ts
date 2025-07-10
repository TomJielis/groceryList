import {ref} from 'vue'

export function useList() {
    const items = ref<any[]>(typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('items') || '[]') : [])

    function addItem(item: string) {
        items.value.push({name: item, quantity: 1})
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    function removeItem(item: string) {

        items.value = items.value.filter(i => i.name !== item)
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    function clearItems() {
        items.value = []
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    function clearItem(item: string){
        items.value = items.value.filter(i => i.name !== item)
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    function increaseItems(item: string) {
        const foundItem = items.value.find(i => i.name === item)
        foundItem.quantity += 1
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    function decreaseItems(item: string) {
        const foundItem = items.value.find(i => i.name === item)

        if(foundItem.quantity <= 1){
            removeItem(item)
            return
        }
        foundItem.quantity -= 1
        localStorage.setItem('items', JSON.stringify(items.value))
    }

    return {
        items,
        addItem,
        removeItem,
        clearItems,
        clearItem,
        increaseItems,
        decreaseItems
    }
}