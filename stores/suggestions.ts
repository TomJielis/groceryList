// stores/suggestions.ts
import {defineStore} from 'pinia'
import grocerySuggestions from '~/data/suggestions.json';
import {useGroceryList} from "~/composables/useGroceryList";
import {useI18nStore} from "~/stores/i18n";
import {useAuthStore} from "~/stores/auth";
const { items, fetchItems } = useGroceryList();

export const useSuggestionStore = defineStore('suggestions', {
    state: () => ({
        defaultSuggestions: [] as { name_nl: string, name_en: string }[],
        userSuggestions: [] as { name: string, unit_price?: number | null }[],
        loading: false,
    }),

    getters: {
        combinedSuggestions(state) {
            // Use active UI locale so switching language updates suggestions immediately
            const i18n = useI18nStore();
            const lang = i18n.locale;

            const defaultMapped = state.defaultSuggestions.map(item => ({
                name: lang === 'nl' ? item.name_nl : item.name_en,
                unit_price: null as number | null
            }))

            const userMapped = state.userSuggestions.map(item => ({
                name: item.name,
                unit_price: item.unit_price || null
            }))

            // Merge: user suggestions take priority (they have prices)
            const all = [...userMapped, ...defaultMapped]
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
                        unit_price: item.unit_price || null,
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
