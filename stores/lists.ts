import { defineStore } from 'pinia';
import type {TGroceryList} from '~/types/TGroceryList';
import { useGroceryList} from "~/composables/useGroceryList";

const { fetchLists } = useGroceryList();
export const useListStore = defineStore('list', {
  state: () => ({
    lists: null as any | null,
  }),
  actions: {
    setList(groceryList: TGroceryList) {
      this.lists = groceryList;
    },
    clearList() {
      this.lists = null;
    },
    async fetchLists() {
      this.lists = await fetchLists();
    }
  },
  persist: true,
})
