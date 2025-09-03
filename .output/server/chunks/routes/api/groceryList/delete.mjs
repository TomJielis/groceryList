import { d as defineEventHandler, r as readBody, g as getCookie } from '../../../nitro/nitro.mjs';
import { apiClient } from '../utils/apiClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _delete = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;
  const token = getCookie(event, "token");
  try {
    const response = await apiClient(
      "/grocery-list/" + id + "/delete",
      {
        method: "DELETE"
      },
      token
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
});

export { _delete as default };
//# sourceMappingURL=delete.mjs.map
