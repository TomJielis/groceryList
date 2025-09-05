import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { a as __nuxt_component_0 } from "../server.mjs";
import { u as useCards } from "./useCards-DWPHgi2W.js";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/hookable/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/unctx/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/radix3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/ufo/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/klona/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "cards",
  __ssrInlineRender: true,
  setup(__props) {
    const { cards } = useCards();
    const selectedCard = ref(null);
    const isModalOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(cards), (card) => {
        _push(`<div class="bg-white rounded-lg shadow p-6 flex flex-col items-center"><h2 class="text-lg font-bold mb-2">${ssrInterpolate(card.title)}</h2><div class="bg-gray-100 p-4 rounded-lg w-full"><img${ssrRenderAttr("src", card.attachment)} alt="Attachment" class="w-full h-auto mb-2 rounded cursor-pointer"></div><button class="mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"> Delete card </button></div>`);
      });
      _push(`<!--]--><div class="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center text-gray-500 border-dashed border-2 border-gray-300"><p class="mb-4">You did not add any card yet.</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/cards/upload" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"${_scopeId}> Add card </button>`);
          } else {
            return [
              createVNode("button", { class: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" }, " Add card ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isModalOpen.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-4 max-w-sm w-full relative"><button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"> ✕ </button><img${ssrRenderAttr("src", (_a = selectedCard.value) == null ? void 0 : _a.attachment)} alt="Attachment Preview" class="w-full h-auto rounded mb-4"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/cards.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-[90vh] p-8 overflow-auto" }, _attrs))}><div class="max-w-3xl mx-auto"><h1 class="text-3xl font-bold text-green-700 mb-6 text-center"> Available cards </h1><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cards/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-Cntk3j79.js.map
