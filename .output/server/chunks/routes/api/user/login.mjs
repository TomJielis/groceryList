import { d as defineEventHandler, r as readBody, s as setCookie } from '../../../nitro/nitro.mjs';
import { apiClient } from '../utils/apiClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const login = defineEventHandler(async (event) => {
  let body = await readBody(event);
  const { email, password } = body;
  try {
    const response = await apiClient("/login", {
      method: "POST",
      body: { email, password }
    }, void 0);
    setCookie(event, "token", response.access_token, {
      httpOnly: true,
      secure: false,
      // Set to true only if HTTPS is enabled
      path: "/",
      sameSite: "lax",
      // Use 'lax' for development on localhost
      maxAge: 60 * 60 * 24 * 28
      // 4 weeks
    });
    event.res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    event.res.setHeader("Access-Control-Allow-Credentials", "true");
    return {
      success: true,
      user: response.user,
      token: response.access_token
    };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      success: false
    };
  }
});

export { login as default };
//# sourceMappingURL=login.mjs.map
