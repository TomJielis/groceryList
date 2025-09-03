import { u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

useRuntimeConfig();
const apiClient = async (endpoint, options = {}, token) => {
  const config2 = useRuntimeConfig();
  const baseUrl = config2.api.url + config2.api.basePath;
  console.log(baseUrl + endpoint);
  const response = await fetch(baseUrl + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      ...options.headers || {}
    },
    body: options.body ? JSON.stringify(options.body) : void 0
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

export { apiClient };
//# sourceMappingURL=apiClient.mjs.map
