import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import "./useCards-DWPHgi2W.js";
import { useRouter } from "vue-router";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "upload",
  __ssrInlineRender: true,
  setup(__props) {
    const formData = ref({
      title: "",
      attachment: null
    });
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-[90vh]" }, _attrs))}><form class="space-y-4 p-4"><div><label for="title" class="block text-sm font-medium text-gray-700">Title</label><input${ssrRenderAttr("value", formData.value.title)} type="text" id="title" required class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg"></div><div><label for="attachment" class="block text-sm font-medium text-gray-700">Image</label><input type="file" id="attachment" required class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg"></div><button type="submit" class="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition"> Save </button></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cards/upload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=upload-D4-AjtkX.js.map
