// stores/suggestions.ts
import {defineStore} from 'pinia'
import grocerySuggestions from '~/data/suggestions.json';
import {useI18nStore} from "~/stores/i18n";
import type {TGroceryListItem} from "~/types/TGroceryListItem";

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
        // The standard suggestions plus every product the user has in one of their lists (their own and shared ones),
        // so a product typed in once is offered in every list from then on
        async fetchSuggestions() {
            this.loading = true
            this.defaultSuggestions = grocerySuggestions
            try {
                const response = await fetch('/api/groceryListItem/', {
                    method: 'POST',
                    body: JSON.stringify({listId: null}),
                    headers: {'Content-Type': 'application/json'},
                })
                if (!response.ok) throw new Error(response.statusText)
                const items: TGroceryListItem[] = (await response.json()).data ?? []

                // Newest first, so a product's latest price wins when it is in several lists
                const newestFirst = [...items].sort((a, b) => b.id - a.id)
                const seen = new Set<string>()
                this.userSuggestions = newestFirst
                    .filter((item) => {
                        const key = item.name.toLowerCase()
                        if (seen.has(key)) return false
                        seen.add(key)
                        return true
                    })
                    .map((item) => ({name: item.name, unit_price: item.unit_price || null}))
            } catch (error) {
                // Without them the standard suggestions still work
                console.error('Fout bij ophalen suggesties:', error)
            } finally {
                this.loading = false
            }
        },
    },
})
