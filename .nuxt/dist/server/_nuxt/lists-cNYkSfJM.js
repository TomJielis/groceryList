import { defineComponent, ref, mergeProps, unref, useSSRContext, withAsyncContext, watch } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { a as useListStore, u as useGroceryList } from "./lists-CEUd3bws.js";
import { b as useAuthStore } from "../server.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/hookable/dist/index.mjs";
import "pinia";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/unctx/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/h3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/radix3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/ufo/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/klona/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ListForm",
  __ssrInlineRender: true,
  emits: ["list-added"],
  setup(__props, { emit: __emit }) {
    useListStore();
    useGroceryList();
    let newList = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-6 max-w-md mx-auto px-4" }, _attrs))}><input type="text"${ssrRenderAttr("value", unref(newList))} placeholder="Enter new list" class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"><button class="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition"> ➕ Create List </button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/list/ListForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "lists",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const listStore = useListStore();
    [__temp, __restore] = withAsyncContext(() => listStore.fetchLists()), await __temp, __restore();
    const auth = useAuthStore();
    useGroceryList();
    const openListForm = ref(false);
    const openDropdown = ref(null);
    function handleList() {
      openListForm.value = false;
    }
    function handleClickOutside(event) {
      const dropdowns = (void 0).querySelectorAll(".dropdown-menu");
      let clickedInside = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) clickedInside = true;
      });
      if (!clickedInside) openDropdown.value = null;
    }
    watch(openDropdown, (val) => {
      if (val !== null) {
        (void 0).addEventListener("click", handleClickOutside);
      } else {
        (void 0).removeEventListener("click", handleClickOutside);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-screen-xl p-4" }, _attrs))}><h1 class="text-xl font-bold mb-4 text-center">📋 Your grocery lists</h1>`);
      if (!openListForm.value) {
        _push(`<div><ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(listStore).lists, (listItem) => {
          var _a, _b;
          _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative"><div class="flex-1 cursor-pointer"><span class="text-base font-medium break-words whitespace-normal">${ssrInterpolate(listItem.name)}</span></div><div class="ml-3 text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">${ssrInterpolate(listItem.grocery_list_items_checked_count ?? 0)}/${ssrInterpolate(listItem.grocery_list_items_count ?? 0)}</div><div class="relative ml-2"><button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 active:bg-gray-200"> ⋮ </button>`);
          if (openDropdown.value === listItem.id) {
            _push(`<div class="dropdown-menu absolute right-0 top-12 z-20 w-40 bg-white border rounded-xl shadow-lg"><button class="block w-full text-left px-4 py-3 hover:bg-gray-100">${ssrInterpolate(((_b = (_a = unref(auth)) == null ? void 0 : _a.user) == null ? void 0 : _b.favorite_list_id) === listItem.id ? "❌ Remove favorite" : "⭐ Favorite")}</button>`);
            if (listItem.created_by == unref(auth).user.id) {
              _push(`<button class="block w-full text-left px-4 py-3 hover:bg-gray-100"> 👥 Share </button>`);
            } else {
              _push(`<!---->`);
            }
            if (listItem.created_by == unref(auth).user.id) {
              _push(`<button class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"> 🗑️ Delete </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul><button class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition" style="${ssrRenderStyle({ "padding-bottom": "env(safe-area-inset-bottom)" })}"> ➕ </button></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$1, { onListAdded: handleList }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/list/lists.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=lists-cNYkSfJM.js.map
