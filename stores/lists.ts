import { defineStore } from 'pinia';
import type { TGroceryList } from '~/types/TGroceryList';

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
      this.lists = this.lists.filter(list => list.id !== id)
    },
    clearList() {
      this.lists = [];
    },
    async fetchLists() {
      try {
        const response = await fetch('/api/groceryList/');
        if (!response.ok) {
          throw new Error(`Failed to fetch lists: ${response.statusText}`);
        }
        const result = await response.json();
        const listResult: TGroceryList[] = result.data;
        this.setList(listResult.map((item: TGroceryList) => ({
          ...item,
        })));
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    },
  },
  persist: true,
})
