import { defineComponent, withAsyncContext, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useGroceryList } from './useGroceryList-Cjm6SaDd.mjs';
import { b as useAuthStore } from './server.mjs';
import { useRouter } from 'vue-router';
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
import 'pinia';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "topItems",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { items, fetchItems } = useGroceryList();
    [__temp, __restore] = withAsyncContext(() => fetchItems()), await __temp, __restore();
    let topFive = ref(items.value.filter((item) => !item.checked).sort((a, b) => b.quantity - a.quantity).slice(0, 5));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow p-6" }, _attrs))}><div class="flex justify-between mb-4"><span class="text-gray-500 flex-1 text-left">Item</span><span class="text-gray-500 flex-1 text-right">Quantity</span></div><ul class="divide-y divide-gray-200"><!--[-->`);
      ssrRenderList(unref(topFive), (item) => {
        _push(`<li class="py-2 flex justify-center items-center text-center"><span class="flex-1 text-left">${ssrInterpolate(item.name)}</span><span class="flex-1 text-right">${ssrInterpolate(item.quantity)}</span></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/topItems.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "dashboardBlock",
  __ssrInlineRender: true,
  props: {
    title: {},
    count: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow p-6 flex flex-col items-center" }, _attrs))}><span class="text-4xl font-bold text-green-600">${ssrInterpolate(_ctx.count)}</span><span class="text-gray-500 mt-2">${ssrInterpolate(_ctx.title)}</span></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/dashboardBlock.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a2, _b;
    var _a;
    let __temp, __restore;
    const authStore = useAuthStore();
    const router = useRouter();
    if (!authStore.user) {
      router.push("/auth/login");
    }
    const { lists, fetchLists } = useGroceryList();
    [__temp, __restore] = withAsyncContext(() => fetchLists()), await __temp, __restore();
    let totalUncheckedItems = ref(
      lists.value.reduce(
        (total, list) => total + (list.grocery_list_items_count - list.grocery_list_items_checked_count),
        0
      )
    );
    let countLists = ref((_a2 = lists.value.length) != null ? _a2 : 0);
    console.log(lists);
    const favoriteListId = (_a = authStore.user) == null ? void 0 : _a.favorite_list_id;
    const favoriteListUrl = favoriteListId ? `/list/${favoriteListId}` : "/list/lists";
    const favoriteList = (_b = lists.value.filter(
      (list) => list.id === favoriteListId
    )[0]) != null ? _b : { grocery_list_items_count: 0, grocery_list_items_checked_count: 0 };
    const favoriteListOpenItems = favoriteList.grocery_list_items_count - favoriteList.grocery_list_items_checked_count;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-[90vh] bg-gray-50 p-8 overflow-auto" }, _attrs))}><div class="max-w-3xl mx-auto"><h1 class="text-3xl font-bold text-green-700 mb-6 text-center"> Grocery Shopping List Dashboard </h1><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "total items to buy",
        count: unref(totalUncheckedItems),
        onClick: ($event) => _ctx.$router.push("/list/lists"),
        class: "cursor-pointer"
      }, null, _parent));
      if (unref(authStore).user.favorite_list_id > 0) {
        _push(ssrRenderComponent(_sfc_main$1, {
          title: favoriteListOpenItems + " items to buy",
          count: " \u2B50" + unref(favoriteList).name,
          onClick: ($event) => _ctx.$router.push(unref(favoriteListUrl)),
          class: "cursor-pointer"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Lists",
        onClick: ($event) => _ctx.$router.push("/list/lists"),
        count: parseInt(unref(countLists)),
        class: "cursor-pointer"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index--vwEfCyr.mjs.map
