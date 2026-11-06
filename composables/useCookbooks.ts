import { ref } from 'vue'
import type { TCookbook } from '~/types/TCookbook'
import type { TInviteLink } from '~/composables/useGroceryList'

// Shared across the pages, like the lists in useGroceryList
const cookbooks = ref<TCookbook[]>([])

/** The user's cookbooks. Who may do what is decided by the API; the pages only hide what wouldn't work. */
export function useCookbooks() {
    async function fetchCookbooks(): Promise<void> {
        const response = await $fetch<{ data: TCookbook[] }>('/api/cookbooks')
        cookbooks.value = response.data
    }

    async function createCookbook(name: string): Promise<TCookbook> {
        const response = await $fetch<{ data: TCookbook }>('/api/cookbooks', { method: 'POST', body: { name } })
        cookbooks.value = [...cookbooks.value, response.data]
        return response.data
    }

    async function renameCookbook(id: number, name: string): Promise<void> {
        const response = await $fetch<{ data: TCookbook }>(`/api/cookbooks/${id}`, { method: 'PUT', body: { name } })
        replace(response.data)
    }

    // Deletes it for everyone (the creator) or leaves it (someone it was shared with)
    async function deleteCookbook(id: number): Promise<void> {
        await $fetch(`/api/cookbooks/${id}`, { method: 'DELETE' })
        cookbooks.value = cookbooks.value.filter(cookbook => cookbook.id !== id)
    }

    // One favourite at most: null clears it
    async function setFavoriteCookbook(id: number | null): Promise<void> {
        await $fetch('/api/cookbooks/favorite', { method: 'POST', body: { cookbookId: id } })
        cookbooks.value = cookbooks.value.map(cookbook => ({ ...cookbook, favorite: cookbook.id === id }))
    }

    /** The invite link to a cookbook (a new one, or the maker's still-fresh one): sharing is only by link */
    async function createInviteLink(id: number): Promise<TInviteLink> {
        const response = await $fetch<{ data: TInviteLink }>(`/api/cookbooks/${id}/inviteLink`, { method: 'POST' })
        if (!response?.data?.url) {
            throw new Error('No invite link in the response')
        }
        return response.data
    }

    async function removeMember(id: number, userId: number): Promise<void> {
        const response = await $fetch<{ data: TCookbook }>(`/api/cookbooks/${id}/members/${userId}`, { method: 'DELETE' })
        replace(response.data)
    }

    function replace(updated: TCookbook) {
        cookbooks.value = cookbooks.value.map(cookbook => (cookbook.id === updated.id ? updated : cookbook))
    }

    return {
        cookbooks,
        fetchCookbooks,
        createCookbook,
        renameCookbook,
        deleteCookbook,
        setFavoriteCookbook,
        createInviteLink,
        removeMember,
    }
}
