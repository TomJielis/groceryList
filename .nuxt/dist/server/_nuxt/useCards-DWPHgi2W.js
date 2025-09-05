import { ref } from "vue";
const cards = ref([]);
function useCards() {
  async function storeCard(newCard) {
    try {
      const response = await $fetch("/api/cards/store", {
        method: "POST",
        body: newCard
      });
      if (response.success && response.data) {
        cards.value.push(response.data);
      } else {
        console.warn("Kaart niet opgeslagen:", response.message);
      }
    } catch (error) {
      console.error("Fout bij opslaan van kaart:", error);
      throw error;
    }
  }
  async function deleteCard(id) {
    try {
      const response = await $fetch("/api/cards/delete", {
        method: "POST",
        body: { id }
      });
      if (response.success) {
        cards.value = cards.value.filter((card) => card.id !== id);
      } else {
        console.warn("Delete card went wrong:", response.message);
      }
    } catch (error) {
      console.error("Delete card went wrong:", error);
      throw error;
    }
  }
  async function getCards() {
    try {
      const response = await $fetch("/api/cards", {
        method: "GET"
      });
      if (response.success && response.data) {
        cards.value = response.data;
      } else {
        console.warn("Kaarten niet geladen:", response.message);
      }
    } catch (error) {
      console.error("Fout bij laden van kaarten:", error);
      throw error;
    }
    return cards;
  }
  return {
    storeCard,
    deleteCard,
    getCards,
    cards
  };
}
export {
  useCards as u
};
//# sourceMappingURL=useCards-DWPHgi2W.js.map
