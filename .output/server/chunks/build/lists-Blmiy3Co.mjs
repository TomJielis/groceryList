import { defineComponent, ref, withAsyncContext, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { u as useGroceryList } from './useGroceryList-Cjm6SaDd.mjs';
import { b as useAuthStore } from './server.mjs';
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
import 'vue-router';
import 'pinia';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ListForm",
  __ssrInlineRender: true,
  emits: ["list-added"],
  setup(__props, { emit: __emit }) {
    useGroceryList();
    let newList = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-6 max-w-md mx-auto px-4" }, _attrs))}><input type="text"${ssrRenderAttr("value", unref(newList))} placeholder="Enter new list" class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"><button class="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-md hover:bg-blue-600 active:scale-[0.98] transition"> \u2795 Create List </button></div>`);
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
    const auth = useAuthStore();
    const list = useGroceryList();
    const { lists, fetchLists } = list;
    const openListForm = ref(false);
    const openDropdown = ref(null);
    [__temp, __restore] = withAsyncContext(() => fetchLists()), await __temp, __restore();
    async function handleList() {
      openListForm.value = false;
      await fetchLists();
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-sm p-4" }, _attrs))}><h1 class="text-xl font-bold mb-4 text-center">\u{1F4CB} Your grocery lists</h1>`);
      if (!openListForm.value) {
        _push(`<div><ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(lists), (listItem) => {
          _push(`<li class="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 active:shadow-md transition relative"><div class="flex-1 cursor-pointer"><span class="text-base font-medium break-words whitespace-normal">${ssrInterpolate(listItem.name)}</span></div><div class="ml-3 text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">${ssrInterpolate(listItem.grocery_list_items_checked_count)}/${ssrInterpolate(listItem.grocery_list_items_count)}</div><div class="relative ml-2"><button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 active:bg-gray-200"> \u22EE </button>`);
          if (openDropdown.value === listItem.id) {
            _push(`<div class="dropdown-menu absolute right-0 top-12 z-20 w-40 bg-white border rounded-xl shadow-lg"><button class="block w-full text-left px-4 py-3 hover:bg-gray-100"> \u2B50 Favorite </button>`);
            if (listItem.created_by == unref(auth).user.id) {
              _push(`<button class="block w-full text-left px-4 py-3 hover:bg-gray-100"> \u{1F465} Share </button>`);
            } else {
              _push(`<!---->`);
            }
            if (listItem.created_by == unref(auth).user.id) {
              _push(`<button class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"> \u{1F5D1}\uFE0F Delete </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul><button class="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition" style="${ssrRenderStyle({ "padding-bottom": "env(safe-area-inset-bottom)" })}"> \u2795 </button></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=lists-Blmiy3Co.mjs.map
