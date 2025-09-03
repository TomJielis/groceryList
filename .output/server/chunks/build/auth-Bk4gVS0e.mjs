import { d as defineNuxtRouteMiddleware, b as useAuthStore } from './server.mjs';
import { useRouter } from 'vue-router';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const router = useRouter();
  const authStore = useAuthStore();
  const user = authStore.user;
  if (!user) {
    return router.push("/auth/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-Bk4gVS0e.mjs.map
