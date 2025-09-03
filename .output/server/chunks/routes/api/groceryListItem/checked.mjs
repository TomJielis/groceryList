import { d as defineEventHandler, g as getCookie, r as readBody } from '../../../nitro/nitro.mjs';
import { apiClient } from '../utils/apiClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const checked = defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  const body = await readBody(event);
  const { id, checked } = body;
  try {
    const response = await apiClient(
      "/grocery-list-item/" + id + "/checked",
      {
        method: "POST",
        "body": { id, checked }
      },
      token
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
});

export { checked as default };
//# sourceMappingURL=checked.mjs.map
