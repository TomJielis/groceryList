import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-CFmmNP2L.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useRouter();
    const userData = ref({
      name: "",
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-[90vh] flex items-center justify-center bg-gray-50 px-4" }, _attrs))}><div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm"><h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">\u{1F4DD} Register</h2><form class="space-y-5"><div><label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" id="name"${ssrRenderAttr("value", userData.value.name)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="Enter your name" required></div><div><label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="email"${ssrRenderAttr("value", userData.value.email)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="you@example.com" required></div><div><label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" id="password"${ssrRenderAttr("value", userData.value.password)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required></div><button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"> Register </button></form><p class="text-sm text-center text-gray-600 mt-6"> Already have an account? `);
      _push(ssrRenderComponent(_component_nuxtLink, {
        to: "/auth/login",
        class: "text-green-500 hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Login`);
          } else {
            return [
              createTextVNode("Login")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-CV3qF5uv.mjs.map
