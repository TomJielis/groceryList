import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useGroceryList } from './useGroceryList-Cjm6SaDd.mjs';
import { defineStore } from 'pinia';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

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
    useGroceryList();
    const suggestionStore = useSuggestionStore();
    const route = useRoute();
    route.params.id;
    const newItem = ref("");
    const filteredSuggestions = computed(() => {
      const suggestions = suggestionStore.combinedSuggestions.filter(
        (item) => item.name.toLowerCase().includes(newItem.value.toLowerCase())
      );
      const isDuplicate = suggestions.some((item) => item.name.toLowerCase() === newItem.value.toLowerCase());
      return newItem.value && !isDuplicate ? [{ name: newItem.value, checked: false }, ...suggestions] : suggestions;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><div class="flex-auto overflow-y-auto p-4"><div class="items-center flex-col"><input type="text"${ssrRenderAttr("value", newItem.value)} placeholder="Enter new item" class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg md:text-xl"><ul class="space-y-3"><!--[-->`);
      ssrRenderList(filteredSuggestions.value, (item) => {
        _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5"><div class="flex items-center space-x-2"><button class="text-lg sm:text-xl md:text-2xl">${ssrInterpolate(item.checked ? "\u2714\uFE0F" : "\u2795")}</button><span class="text-sm sm:text-base md:text-lg">${ssrInterpolate(item.name)}</span></div></li>`);
      });
      _push(`<!--]--></ul></div></div><div class="fixed bottom-0 left-0 w-full mt-6 space-y-3 p-4"><button class="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"> \u2190 Back </button></div></div>`);
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
    const route = useRoute();
    const listId = route.params.id;
    const showAddItem = ref(false);
    const showCheckedItems = ref(false);
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-sm p-4" }, _attrs))} data-v-05ff90e5><h1 class="text-2xl font-bold mb-4 text-center" data-v-05ff90e5>\u{1F6D2} Grocery list</h1>`);
      if (!showAddItem.value) {
        _push(`<div data-v-05ff90e5><ul class="space-y-3 mb-20" data-v-05ff90e5><ul${ssrRenderAttrs({
          name: "fade",
          class: "space-y-3 mb-20"
        })} data-v-05ff90e5>`);
        ssrRenderList(unref(uncheckedItems), (item) => {
          _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden" data-v-05ff90e5><div class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity" style="${ssrRenderStyle({ opacity: item.swipeOffset < 0 ? 1 : 0 })}" data-v-05ff90e5> Verwijderen </div><div class="relative flex items-center flex-1 transition-transform" style="${ssrRenderStyle({ transform: `translateX(${item.swipeOffset || 0}px)` })}" data-v-05ff90e5><input type="checkbox" class="h-6 w-6 text-green-600 rounded flex-shrink-0"${ssrIncludeBooleanAttr(item.checked) ? " checked" : ""} data-v-05ff90e5><span class="${ssrRenderClass([{ "line-through text-gray-500": item.checked }, "text-base font-medium break-words whitespace-normal ml-2"])}" data-v-05ff90e5>${ssrInterpolate(item.name)}</span></div><div class="flex items-center space-x-2" data-v-05ff90e5><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-05ff90e5>\u2212 </button><span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center" data-v-05ff90e5>${ssrInterpolate(item.quantity || 1)}</span><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-05ff90e5>+ </button></div></li>`);
        });
        _push(`</ul>`);
        if (unref(checkedItems).length) {
          _push(`<p class="text-center text-gray-700 mt-4 cursor-pointer hover:underline" data-v-05ff90e5>${ssrInterpolate(showCheckedItems.value ? "Hide" : "Show")} checked items (${ssrInterpolate(unref(checkedItems).length)}) </p>`);
        } else {
          _push(`<!---->`);
        }
        if (showCheckedItems.value) {
          _push(`<ul class="space-y-3 mt-4" data-v-05ff90e5><ul${ssrRenderAttrs({
            name: "fade",
            class: "space-y-3 mb-20"
          })} data-v-05ff90e5>`);
          ssrRenderList(unref(checkedItems), (item) => {
            _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative overflow-hidden" data-v-05ff90e5><div class="absolute inset-0 bg-red-200 text-white flex items-center justify-center transition-opacity" style="${ssrRenderStyle({ opacity: item.swipeOffset < 0 ? 1 : 0 })}" data-v-05ff90e5> Verwijderen </div><div class="relative flex items-center flex-1 transition-transform" style="${ssrRenderStyle({ transform: `translateX(${item.swipeOffset || 0}px)` })}" data-v-05ff90e5><input type="checkbox" class="h-6 w-6 text-green-600 rounded flex-shrink-0"${ssrIncludeBooleanAttr(item.checked) ? " checked" : ""} data-v-05ff90e5><span class="${ssrRenderClass([{ "line-through text-gray-500": item.checked }, "text-base font-medium break-words whitespace-normal ml-2"])}" data-v-05ff90e5>${ssrInterpolate(item.name)}</span></div><div class="flex items-center space-x-2" data-v-05ff90e5><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-05ff90e5>\u2212 </button><span class="text-sm sm:text-base font-semibold min-w-[20px] sm:min-w-[24px] text-center" data-v-05ff90e5>${ssrInterpolate(item.quantity || 1)}</span><button class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-200 rounded-full text-base sm:text-lg font-bold hover:bg-gray-300" data-v-05ff90e5>+ </button></div></li>`);
          });
          _push(`</ul></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul><button class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition" data-v-05ff90e5> \u2795 </button></div>`);
      } else {
        _push(`<div data-v-05ff90e5>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          onItemAdded: handleItemAdded,
          onClose: ($event) => showAddItem.value = false
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
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-05ff90e5"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DjOyHF-5.mjs.map
