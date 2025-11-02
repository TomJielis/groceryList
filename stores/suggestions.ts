// stores/suggestions.ts
import {defineStore} from 'pinia'
import grocerySuggestions from '~/data/suggestions.json';
import {useGroceryList} from "~/composables/useGroceryList";
import {useI18nStore} from "~/stores/i18n";
const { items, fetchItems } = useGroceryList();

export const useSuggestionStore = defineStore('suggestions', {
    state: () => ({
        defaultSuggestions: [] as { name_nl: string, name_en: string }[],
        userSuggestions: [] as { name: string }[],
        loading: false,
    }),

    getters: {
        combinedSuggestions(state) {
            const i18n = useI18nStore();
            const lang = i18n.locale;

            const defaultMapped = state.defaultSuggestions.map(item => ({
                name: lang === 'nl' ? item.name_nl : item.name_en
            }))

            const userMapped = state.userSuggestions.map(item => ({
                name: item.name
            }))
            const all = [...defaultMapped, ...userMapped]
            const seen = new Set<string>()
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
            await fetchItems();
            this.loading = true
            try {
                this.defaultSuggestions = grocerySuggestions

                const res = items.value;
                this.userSuggestions = Array.isArray(res)
                    ? res.filter((item: any) => item.checked).map((item: any) => ({
                        name: item.name,
                        checked: false
                    }))
                    : []
            } catch (error) {
                console.error('Fout bij ophalen suggesties:', error)
            } finally {
                this.loading = false
            }
        },
    },
})
