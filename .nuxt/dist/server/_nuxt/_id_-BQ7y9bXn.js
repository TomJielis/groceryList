import { defineComponent, ref, computed, mergeProps, unref, useSSRContext, withAsyncContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { u as useGroceryList, a as useListStore } from "./lists-CEUd3bws.js";
import { defineStore } from "pinia";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/unctx/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/h3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/defu/dist/defu.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/radix3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/ufo/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/klona/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/@unhead/vue/dist/index.mjs";
const grocerySuggestions = [
  {
    name: "Koffie"
  },
  {
    name: "Suiker"
  },
  {
    name: "paprika"
  },
  {
    name: "fudge"
  },
  {
    name: "Rijst"
  },
  {
    name: "Brenta"
  },
  {
    name: "Yoghurt"
  },
  {
    name: "Kookroom"
  },
  {
    name: "Ui"
  },
  {
    name: "Avocado"
  },
  {
    name: "Kaas"
  },
  {
    name: "Mango"
  },
  {
    name: "Boter"
  },
  {
    name: "Gecondenseerde melk"
  },
  {
    name: "Mayonaise"
  },
  {
    name: "Handzeep"
  },
  {
    name: "Winterglow"
  },
  {
    name: "Pickwick earl grey"
  },
  {
    name: "Honing"
  },
  {
    name: "Zout"
  },
  {
    name: "Zakdoekjes"
  },
  {
    name: "Kaas"
  },
  {
    name: "Ham"
  },
  {
    name: "Danio"
  },
  {
    name: "Danio"
  },
  {
    name: "Pasta"
  },
  {
    name: "Penne"
  },
  {
    name: "Mozzarella"
  },
  {
    name: "Pesto"
  },
  {
    name: "Tomatensaus"
  },
  {
    name: "Groente bouillon"
  },
  {
    name: "Kip"
  },
  {
    name: "Yakult"
  },
  {
    name: "Vla"
  },
  {
    name: "Griekse yoghurt"
  },
  {
    name: "Aarbeien"
  },
  {
    name: "Banaan"
  },
  {
    name: "Appel"
  },
  {
    name: "Komkommer"
  },
  {
    name: "Knoflook"
  },
  {
    name: "Peterselie"
  },
  {
    name: "Basilicum"
  },
  {
    name: "Oregano"
  },
  {
    name: "Paprika poeder"
  },
  {
    name: "Kerrie poeder"
  },
  {
    name: "Kaneel"
  },
  {
    name: "Chili poeder"
  },
  {
    name: "Zwarte peper"
  },
  {
    name: "Olijfolie"
  },
  {
    name: "Zonnebloemolie"
  },
  {
    name: "Azijn"
  },
  {
    name: "Sojasaus"
  },
  {
    name: "Mosterd"
  },
  {
    name: "Ketchup"
  },
  {
    name: "Tandpasta"
  },
  {
    name: "Shampoo"
  },
  {
    name: "Douchegel"
  },
  {
    name: "Toiletpapier"
  },
  {
    name: "Wasmiddel"
  },
  {
    name: "Vaatwasmiddel"
  },
  {
    name: "Schoonmaakmiddel"
  },
  {
    name: "Afwasmiddel"
  },
  {
    name: "Keukenpapier"
  },
  {
    name: "Aluminiumfolie"
  },
  {
    name: "Plasticfolie"
  },
  {
    name: "Zakken"
  },
  {
    name: "Koffiepads"
  },
  {
    name: "Theezakjes"
  },
  {
    name: "Snoepjes"
  },
  {
    name: "Chips"
  },
  {
    name: "Noten"
  },
  {
    name: "Gedroogd fruit"
  },
  {
    name: "Muesli"
  },
  {
    name: "Havermout"
  },
  {
    name: "Granola"
  },
  {
    name: "Pindakaas"
  },
  {
    name: "Nutella"
  },
  {
    name: "Jam"
  },
  {
    name: "Honing"
  },
  {
    name: "Suiker"
  },
  {
    name: "Zout"
  },
  {
    name: "Peper"
  },
  {
    name: "Bakpoeder"
  },
  {
    name: "Baksoda"
  },
  {
    name: "Bloem"
  },
  {
    name: "Maizena"
  },
  {
    name: "Rijstmeel"
  },
  {
    name: "Kokosmelk"
  },
  {
    name: "Tomatenpuree"
  },
  {
    name: "Bouillonblokjes"
  },
  {
    name: "Kruidenmixen"
  },
  {
    name: "Pasta saus"
  }
];
const { items, fetchItems } = useGroceryList();
const useSuggestionStore = defineStore("suggestions", {
  state: () => ({
    defaultSuggestions: [],
    userSuggestions: [],
    loading: false
  }),
  getters: {
    combinedSuggestions(state) {
      const all = [...state.defaultSuggestions, ...state.userSuggestions];
      const seen = /* @__PURE__ */ new Set();
      return all.filter((item) => {
        const lower = item.name.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });
    }
  },
  actions: {
    async fetchSuggestions() {
      await fetchItems();
      this.loading = true;
      try {
        this.defaultSuggestions = grocerySuggestions;
        const res = items.value;
        this.userSuggestions = Array.isArray(res) ? res.filter((item) => item.checked).map((item) => ({ name: item.name, checked: false })) : [];
      } catch (error) {
        console.error("Fout bij ophalen suggesties:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AddItemListForm",
  __ssrInlineRender: true,
  emits: ["item-added", "close"],
  setup(__props, { emit: __emit }) {
    const {
      items: items2,
      fetchItems: fetchItems2
    } = useGroceryList();
    const suggestionStore = useSuggestionStore();
    const route = useRoute();
    const listId = parseInt(route.params.id);
    const newItem = ref("");
    const filteredSuggestions = computed(() => {
      const suggestions = suggestionStore.combinedSuggestions.filter(
        (item) => item.name.toLowerCase().includes(newItem.value.toLowerCase())
      );
      const isDuplicate = suggestions.some((item) => item.name.toLowerCase() === newItem.value.toLowerCase());
      return newItem.value && !isDuplicate ? [{ name: newItem.value, checked: false }, ...suggestions] : suggestions;
    });
    fetchItems2(listId);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><div class="flex-auto overflow-y-auto p-4 pb-20"><div class="items-center flex-col"><input type="text"${ssrRenderAttr("value", newItem.value)} placeholder="Enter new item" class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg md:text-xl"><ul class="space-y-3"><!--[-->`);
      ssrRenderList(filteredSuggestions.value, (item) => {
        var _a;
        _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5"><div class="flex items-center justify-between w-full"><div class="flex items-center space-x-2"><button class="${ssrRenderClass(unref(items2).some((listItem) => listItem.name.toLowerCase() === item.name.toLowerCase()) ? "text-green-500" : "text-black")}">${ssrInterpolate(unref(items2).filter((item2) => !item2.checked).some((listItem) => listItem.name.toLowerCase() === item.name.toLowerCase()) ? "✔️" : "➕")}</button><span class="text-sm sm:text-base md:text-lg">${ssrInterpolate(item.name)}</span></div>`);
        if (unref(items2).filter((item2) => !item2.checked).some((listItem) => listItem.name.toLowerCase() === item.name.toLowerCase())) {
          _push(`<div class="flex items-center space-x-2"><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300">− </button><span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center">${ssrInterpolate(((_a = unref(items2).find((listItem) => listItem.name.toLowerCase() === item.name.toLowerCase())) == null ? void 0 : _a.quantity) ?? 1)}</span>`);
          if (unref(items2).filter((item2) => !item2.checked).some((listItem) => listItem.name.toLowerCase() === item.name.toLowerCase())) {
            _push(`<button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300">+ </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></li>`);
      });
      _push(`<!--]--></ul></div></div><div class="fixed bottom-0 left-0 w-full mt-6 space-y-3 p-4"><button class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"> ← Back </button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/list/AddItemListForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const listStore = useListStore();
    const route = useRoute();
    const listId = route.params.id;
    const showAddItem = ref(false);
    const showCheckedItems = ref(false);
    ref(false);
    ref(0);
    const {
      items: items2,
      fetchItems: fetchItems2
    } = useGroceryList();
    [__temp, __restore] = withAsyncContext(() => fetchItems2(listId)), await __temp, __restore();
    function handleItemAdded() {
      showAddItem.value = false;
      fetchItems2(listId);
    }
    const uncheckedItems = computed(() => items2.value.filter((item) => !item.checked));
    const checkedItems = computed(() => items2.value.filter((item) => item.checked));
    ref(0);
    async function closeAddItemListForm() {
      showAddItem.value = false;
      await fetchItems2(listId);
    }
    const list = listStore.lists.find((list2) => list2.id == parseInt(listId));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-screen-xl p-4 overflow-y-auto" }, _attrs))} data-v-6fee0a0c><h1 class="text-2xl font-bold mb-4 text-center" data-v-6fee0a0c>🛒 ${ssrInterpolate((_a = unref(list)) == null ? void 0 : _a.name)}</h1>`);
      if (!showAddItem.value) {
        _push(`<div data-v-6fee0a0c><ul class="space-y-3 mb-20" data-v-6fee0a0c><ul${ssrRenderAttrs({
          name: "fade",
          class: "space-y-3 mb-20"
        })} data-v-6fee0a0c>`);
        ssrRenderList(uncheckedItems.value, (item) => {
          _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden" data-v-6fee0a0c><div class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity pointer-events-none" style="${ssrRenderStyle({ opacity: item.swipeOffset < 0 ? 1 : 0 })}" data-v-6fee0a0c> Verwijderen </div><div class="relative flex items-center flex-1 transition-transform" style="${ssrRenderStyle({ transform: `translateX(${item.swipeOffset || 0}px)` })}" data-v-6fee0a0c><input type="checkbox" class="h-6 w-6 text-green-600 rounded flex-shrink-0"${ssrIncludeBooleanAttr(item.checked) ? " checked" : ""} data-v-6fee0a0c><span class="${ssrRenderClass([{ "line-through text-gray-500": item.checked }, "text-base font-medium break-words whitespace-normal ml-2"])}" data-v-6fee0a0c>${ssrInterpolate(item.name)}</span></div><div class="flex items-center space-x-2" data-v-6fee0a0c><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-6fee0a0c> − </button><span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center" data-v-6fee0a0c>${ssrInterpolate(item.quantity || 1)}</span><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-6fee0a0c> + </button></div></li>`);
        });
        _push(`</ul>`);
        if (checkedItems.value.length) {
          _push(`<p class="text-center text-gray-700 mt-4 cursor-pointer hover:underline" data-v-6fee0a0c>${ssrInterpolate(showCheckedItems.value ? "Hide" : "Show")} checked items (${ssrInterpolate(checkedItems.value.length)}) </p>`);
        } else {
          _push(`<!---->`);
        }
        if (showCheckedItems.value) {
          _push(`<ul class="space-y-3 mt-4" data-v-6fee0a0c><ul${ssrRenderAttrs({
            name: "fade",
            class: "space-y-3 mb-20"
          })} data-v-6fee0a0c>`);
          ssrRenderList(checkedItems.value, (item) => {
            _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden" data-v-6fee0a0c><div class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity pointer-events-none" style="${ssrRenderStyle({ opacity: item.swipeOffset < 0 ? 1 : 0 })}" data-v-6fee0a0c> Verwijderen </div><div class="relative flex items-center flex-1 transition-transform" style="${ssrRenderStyle({ transform: `translateX(${item.swipeOffset || 0}px)` })}" data-v-6fee0a0c><input type="checkbox" class="h-6 w-6 text-green-600 rounded flex-shrink-0"${ssrIncludeBooleanAttr(item.checked) ? " checked" : ""} data-v-6fee0a0c><span class="${ssrRenderClass([{ "line-through text-gray-500": item.checked }, "text-base font-medium break-words whitespace-normal ml-2"])}" data-v-6fee0a0c>${ssrInterpolate(item.name)}</span></div><div class="flex items-center space-x-2" data-v-6fee0a0c><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-6fee0a0c> − </button><span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center" data-v-6fee0a0c>${ssrInterpolate(item.quantity || 1)}</span><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-6fee0a0c> + </button></div></li>`);
          });
          _push(`</ul></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul><button class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition" data-v-6fee0a0c> ➕ </button></div>`);
      } else {
        _push(`<div data-v-6fee0a0c>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          onItemAdded: handleItemAdded,
          onClose: closeAddItemListForm
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/list/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6fee0a0c"]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-BQ7y9bXn.js.map
