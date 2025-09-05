import { defineStore } from "pinia";
import { ref } from "vue";
function useGroceryList() {
  let items = ref([]);
  let lists2 = ref([]);
  async function fetchLists2() {
    try {
      const response = await fetch("/api/groceryList/");
      if (!response.ok) {
        throw new Error(`Failed to fetch lists: ${response.statusText}`);
      }
      let listResult = (await response.json()).data;
      lists2.value = listResult.map((item) => ({
        ...item
      }));
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  }
  async function createList(name) {
    const response = await fetch("/api/groceryList/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error(`Failed to create list: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error(`Failed to create list: ${response.statusText}`);
    }
    return data;
  }
  async function shareList(listId, email) {
    let route = "/api/groceryList/share";
    $fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { id: listId, email }
    });
  }
  async function favorite(id) {
    const response = await fetch("/api/groceryList/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`Failed to create list: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.message) {
      throw new Error(`Failed to create list: ${response.statusText}`);
    }
  }
  async function deleteList(id) {
    try {
      const response = await fetch("/api/groceryList/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error(`Failed to create list: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  }
  async function fetchItems(listId = null) {
    try {
      const response = await fetch("/api/groceryListItem/", {
        method: "POST",
        body: JSON.stringify({ listId }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      let listItems = (await response.json()).data;
      items.value = listItems.map((item) => ({
        ...item,
        quantity: item.quantity || 1
      }));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }
  async function addItem(item, listId) {
    const { data } = await $fetch("/api/groceryListItem/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { name: item, quantity: 1, listId }
    });
    items.value = [...items.value, data];
  }
  function clearItem(item) {
    items.value = items.value.filter((i) => i.name !== item.name);
    let route = "/api/groceryListItem/delete";
    $fetch(route, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: { id: item.id }
    });
  }
  function checked(item) {
    let route = "/api/groceryListItem/checked";
    $fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { id: item.id, checked: item.checked }
    });
  }
  function increaseItems(item) {
    const foundItem = items.value.find((i) => i.id === item.id);
    foundItem.quantity += 1;
    let route = "/api/groceryListItem/increase";
    $fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { id: item.id }
    });
  }
  function decreaseItems(item) {
    const foundItem = items.value.find((i) => i.id === item.id);
    if (foundItem.quantity === 1) {
      clearItem(item);
      return;
    }
    foundItem.quantity -= 1;
    let route = "/api/groceryListItem/decrease";
    $fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { id: item.id }
    });
  }
  return {
    items,
    lists: lists2,
    fetchLists: fetchLists2,
    favorite,
    createList,
    shareList,
    deleteList,
    fetchItems,
    addItem,
    checked,
    clearItem,
    increaseItems,
    decreaseItems
  };
}
const { fetchLists, lists } = useGroceryList();
const useListStore = defineStore("list", {
  state: () => ({
    lists: []
  }),
  actions: {
    setList(groceryList) {
      this.lists = groceryList;
    },
    addList(groceryList) {
      this.lists.push(groceryList);
    },
    removeList(id) {
      this.lists = this.lists.filter((list) => list.id !== id);
    },
    clearList() {
      this.lists = [];
    },
    async fetchLists() {
      await fetchLists();
      this.setList(lists);
    }
  },
  persist: true
});
export {
  useListStore as a,
  useGroceryList as u
};
//# sourceMappingURL=lists-CEUd3bws.js.map
