import { defineStore } from 'pinia';
import type {TGroceryList} from '~/types/TGroceryList';
import { useGroceryList} from "~/composables/useGroceryList";

const { fetchLists, lists } = useGroceryList();
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
    removeList(id: number) {
        // @ts-ignore
      this.lists = this.lists.filter(list => list.id !== id)
    },
    clearList() {
      this.lists = [];
    },
    async fetchLists() {
      await fetchLists();
      // @ts-ignore
       this.setList(lists);
    }
  },
  persist: true,
})
