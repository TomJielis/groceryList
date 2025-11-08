import { defineStore } from 'pinia';
import type { TGroceryList } from '~/types/TGroceryList';
import { useGroceryList } from "~/composables/useGroceryList";

const { fetchLists, lists, fetchPendingLists } = useGroceryList();
export const useListStore = defineStore('list', {
  state: () => ({
    lists: [] as TGroceryList[],
    pendingLists: [] as TGroceryList[],
  }),
  actions: {
    setList(groceryList: TGroceryList[]) {
      this.lists = groceryList;
    },
    addList(groceryList: TGroceryList) {
      this.lists.push(groceryList);
    },
    removeList(id: number) {
      this.lists = this.lists.filter(list => list.id !== id)
    },
    clearList() {
      this.lists = [];
    },
    async fetchLists() {
      await fetchLists();
      // @ts-ignore
      this.setList(lists);
    },
    setPendingLists(pending: TGroceryList[]) {
      this.pendingLists = pending;
    },
    addPendingList(groceryList: TGroceryList) {
      this.pendingLists.push(groceryList);
    },
    removePendingList(id: number) {
      this.pendingLists = this.pendingLists.filter(list => list.id !== id);
    },
    clearPendingLists() {
      this.pendingLists = [];
    },
    async fetchPendingLists() {
      const result = await fetchPendingLists();
      this.setPendingLists(result || []);
    }
  },
  persist: true,
})
