// stores/suggestions.ts
import {defineStore} from 'pinia'
import grocerySuggestions from '~/data/suggestions.json';
import {useGroceryList} from "~/composables/useGroceryList";
const { fetchItems } = useGroceryList();

export const useSuggestionStore = defineStore('suggestions', {
    state: () => ({
        defaultSuggestions: [] as { name: string }[],
        userSuggestions: [] as { name: string }[],
        loading: false,
    }),

    getters: {
        combinedSuggestions(state) {
            const all = [...state.defaultSuggestions, ...state.userSuggestions]
            const seen = new Set()
            return all.filter((item) => {
                const lower = item.name.toLowerCase()
                if (seen.has(lower)) return false
                seen.add(lower)
                return true
            })
        },
    },

    actions: {
        async fetchSuggestions() {
            this.loading = true
            try {
                this.defaultSuggestions = grocerySuggestions

                // const res = await fetchItems()
                // this.userSuggestions = (res.items || []).map((item: any) => ({ name: item.name }));
                this.userSuggestions = ([]).map((item: any) => ({ name: item.name }));
            } catch (error) {
                console.error('Fout bij ophalen suggesties:', error)
            } finally {
                this.loading = false
            }
        },
    },
})
