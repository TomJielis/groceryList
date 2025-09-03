import { d as defineEventHandler, g as getCookie, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index = defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  const config = useRuntimeConfig();
  const baseUrl = config.api.url + config.api.basePath;
  const response = await fetch(
    baseUrl + "/grocery-list/index",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
        // Assuming token is stored in context
      }
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
});

export { index as default };
//# sourceMappingURL=index.mjs.map
