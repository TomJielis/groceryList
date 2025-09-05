// composables/useCards.ts
import { ref } from 'vue'


export interface Card {
    id: number
    title: string
    attachment: string
}

let cards = ref([]);

export function useCards() {
    async function storeCard(newCard: Omit<Card, 'id'>) {
        try {
            const response = await $fetch('/api/cards/store', {
                method: 'POST',
                body: newCard,
            })

            if (response.success && response.data) {
                cards.value.push(response.data)
            } else {
                console.warn('Kaart niet opgeslagen:', response.message)
            }
        } catch (error) {
            console.error('Fout bij opslaan van kaart:', error)
            throw error
        }
    }

    async function deleteCard(id: number) {
        try {
            const response = await $fetch('/api/cards/delete', {
                method: 'POST',
                body: { id },
            })

            if (response.success) {
                cards.value = cards.value.filter(card => card.id !== id)
            } else {
                console.warn('Delete card went wrong:', response.message)
            }
        } catch (error) {
            console.error('Delete card went wrong:', error)
            throw error
        }
    }

    async function getCards() {
        try {
            const response = await fetch('/api/cards/');
            if (!response.ok) {
                throw new Error(`Failed to fetch lists: ${response.statusText}`);
            }
            let result = (await response.json()).data;
            cards.value = result;
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    return {
        storeCard,
        deleteCard,
        getCards,
        cards,
    }
}
