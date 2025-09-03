import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-CFmmNP2L.mjs';
import { _ as _export_sfc, b as useAuthStore } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useAuthStore();
    useRouter();
    const userData = ref({
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center bg-gray-50 px-4 h-[90vh]" }, _attrs))} data-v-bec46787><div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm" data-v-bec46787><h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900" data-v-bec46787>\u{1F6D2} Login</h2><form class="space-y-5" data-v-bec46787><div data-v-bec46787><label for="email" class="block text-sm font-medium text-gray-700 mb-1" data-v-bec46787>Email</label><input type="email" id="email"${ssrRenderAttr("value", userData.value.email)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="you@example.com" required data-v-bec46787></div><div data-v-bec46787><label for="password" class="block text-sm font-medium text-gray-700 mb-1" data-v-bec46787>Password</label><input type="password" id="password"${ssrRenderAttr("value", userData.value.password)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required data-v-bec46787></div><button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold" data-v-bec46787> Login </button></form><p class="text-sm text-center text-gray-600 mt-6" data-v-bec46787> Don&#39;t have an account? <a href="/auth/register" class="text-green-500 hover:underline font-medium" data-v-bec46787>Register</a></p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bec46787"]]);

export { login as default };
//# sourceMappingURL=login-fhlR7iH4.mjs.map
