import { ref } from 'vue'
import type { TWeekMenu, TWeekMenuEntry } from '~/types/TWeekMenu'
import type { TInviteLink } from '~/composables/useGroceryList'

// Shared across the pages, like the cookbooks in useCookbooks
const menus = ref<TWeekMenu[]>([])
const loaded = ref(false)
// The latest fetch of the menus started; an older one landing later (or one from before a menu was made, renamed or
// deleted) is dropped
let menusFetch = 0

/** Logging out (or another account in the same tab): nothing of the previous user's menus stays */
export function resetWeekMenus() {
    menusFetch += 1
    menus.value = []
    loaded.value = false
    // The menu last looked at and the servings used per menu are this user's too
    if (import.meta.client) {
        Object.keys(localStorage)
            .filter(key => key === 'weekMenuSelected' || key.startsWith('weekMenuServings:'))
            .forEach(key => localStorage.removeItem(key))
    }
}

/** The week menus the user is in and what's planned in them (the API's /week-menus routes) */
export function useWeekMenu() {
    async function fetchMenus(): Promise<void> {
        const mine = ++menusFetch
        const response = await $fetch<{ data: TWeekMenu[] }>('/api/weekMenus/index')
        if (mine !== menusFetch) return
        menus.value = response.data
        loaded.value = true
    }

    async function createMenu(name?: string): Promise<TWeekMenu> {
        const response = await $fetch<{ data: TWeekMenu }>('/api/weekMenus/store', { method: 'POST', body: name ? { name } : {} })
        menusFetch += 1
        menus.value = [...menus.value, response.data]
        return response.data
    }

    async function renameMenu(id: number, name: string): Promise<void> {
        const response = await $fetch<{ data: TWeekMenu }>(`/api/weekMenus/${id}/update`, { method: 'POST', body: { name } })
        replace(response.data)
    }

    // The creator deletes it for everyone; someone who joined leaves it
    async function deleteMenu(id: number): Promise<void> {
        await $fetch(`/api/weekMenus/${id}/delete`, { method: 'DELETE' })
        menusFetch += 1
        menus.value = menus.value.filter(menu => menu.id !== id)
    }

    async function removeMember(id: number, userId: number): Promise<void> {
        const response = await $fetch<{ data: TWeekMenu }>(`/api/weekMenus/${id}/members/${userId}`, { method: 'DELETE' })
        replace(response.data)
    }

    // Only the creator makes one (like a cookbook)
    async function createInviteLink(id: number): Promise<TInviteLink> {
        const response = await $fetch<{ data: TInviteLink }>(`/api/weekMenus/${id}/invite-link`, { method: 'POST' })
        if (!response?.data?.url) throw new Error('No invite link in the response')
        return response.data
    }

    async function fetchEntries(id: number, from: string, to: string): Promise<TWeekMenuEntry[]> {
        const response = await $fetch<{ data: TWeekMenuEntry[] }>(`/api/weekMenus/${id}/entries`, { query: { from, to } })
        return response.data
    }

    // servings: the number last used in this menu; without it the recipe's own
    async function plan(id: number, date: string, recipeId: number, servings?: number): Promise<TWeekMenuEntry> {
        const response = await $fetch<{ data: TWeekMenuEntry }>(`/api/weekMenus/${id}/entries`, { method: 'POST', body: { date, recipe_id: recipeId, ...(servings ? { servings } : {}) } })
        return response.data
    }

    async function updateEntry(id: number, entryId: number, change: { date?: string; servings?: number; reset_added?: boolean }): Promise<TWeekMenuEntry> {
        const response = await $fetch<{ data: TWeekMenuEntry }>(`/api/weekMenus/${id}/entries/${entryId}/update`, { method: 'POST', body: change })
        return response.data
    }

    async function removeEntry(id: number, entryId: number): Promise<void> {
        await $fetch(`/api/weekMenus/${id}/entries/${entryId}/delete`, { method: 'DELETE' })
    }

    // "Put on my list", step one: claims the dishes nobody put on a list yet (with who and which list, so everyone
    // sees it) and answers which ones it got: two people at once don't both put them on a list
    async function claim(id: number, entryIds: number[], listId: number): Promise<number[]> {
        const response = await $fetch<{ data: { marked_ids?: number[] } }>(`/api/weekMenus/${id}/entries/added-to-list`, { method: 'POST', body: { entry_ids: entryIds, list_id: listId } })
        return (response?.data?.marked_ids ?? []).map(Number)
    }

    // Gives back the user's own claim, when putting the dishes on the list failed after all
    async function unclaim(id: number, entryIds: number[]): Promise<void> {
        await $fetch(`/api/weekMenus/${id}/entries/added-to-list`, { method: 'POST', body: { entry_ids: entryIds, undo: true } })
    }

    async function addToList(listId: number, items: { name: string; quantity: number }[]): Promise<void> {
        await $fetch(`/api/groceryList/${listId}/weekPlannerAdd`, { method: 'POST', body: { items } })
    }

    function replace(updated: TWeekMenu) {
        menusFetch += 1
        menus.value = menus.value.map(menu => (menu.id === updated.id ? updated : menu))
    }

    return {
        menus, loaded, fetchMenus, createMenu, renameMenu, deleteMenu, removeMember, createInviteLink,
        fetchEntries, plan, updateEntry, removeEntry, claim, unclaim, addToList,
    }
}
