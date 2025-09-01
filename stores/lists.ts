import { defineStore } from 'pinia';
import type {TGroceryList} from '~/types/TGroceryList';
import { useGroceryList} from "~/composables/useGroceryList";

const { fetchLists } = useGroceryList();
export const useListStore = defineStore('list', {
  state: () => ({
    lists: [] as TGroceryList[],
  }),
  actions: {
    setList(groceryList: TGroceryList[]) {
      this.lists = groceryList;
    },
    addList(groceryList: TGroceryList) {
      this.lists.push(groceryList);
    },
    clearList() {
      this.lists = [];
    },
    async fetchLists() {
      // @ts-ignore
      this.lists = await fetchLists();
    }
  },
  persist: true,
})
