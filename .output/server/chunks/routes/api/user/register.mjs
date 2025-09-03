import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import { apiClient } from '../utils/apiClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const register = defineEventHandler(async (event) => {
  let body = await readBody(event);
  const { name, email, password } = body;
  try {
    const response = await apiClient("/register", {
      method: "POST",
      body: { name, email, password }
    }, void 0);
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      success: false
    };
  }
});

export { register as default };
//# sourceMappingURL=register.mjs.map
