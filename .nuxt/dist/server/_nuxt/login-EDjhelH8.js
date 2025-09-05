import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { u as useAuth } from "./useAuth-wezdSaW4.js";
import { b as useAuthStore, _ as _export_sfc } from "../server.mjs";
import { useRouter } from "vue-router";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/hookable/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/unctx/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/defu/dist/defu.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/radix3/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/ufo/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/klona/dist/index.mjs";
import "/Users/tomjielisvanwijgerden/projects/groceryList/node_modules/@unhead/vue/dist/index.mjs";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center px-4 h-[90vh]" }, _attrs))} data-v-84af8226><div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm" data-v-84af8226><h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900" data-v-84af8226>🛒 Login</h2><form class="space-y-5" data-v-84af8226><div data-v-84af8226><label for="email" class="block text-sm font-medium text-gray-700 mb-1" data-v-84af8226>Email</label><input type="email" id="email"${ssrRenderAttr("value", userData.value.email)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="you@example.com" required data-v-84af8226></div><div data-v-84af8226><label for="password" class="block text-sm font-medium text-gray-700 mb-1" data-v-84af8226>Password</label><input type="password" id="password"${ssrRenderAttr("value", userData.value.password)} class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400" placeholder="••••••••" required data-v-84af8226></div><button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold" data-v-84af8226> Login </button></form><p class="text-sm text-center text-gray-600 mt-6" data-v-84af8226> Don&#39;t have an account? <a href="/auth/register" class="text-green-500 hover:underline font-medium" data-v-84af8226>Register</a></p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-84af8226"]]);
export {
  login as default
};
//# sourceMappingURL=login-EDjhelH8.js.map
