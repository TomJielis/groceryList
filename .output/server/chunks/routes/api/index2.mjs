import { d as defineEventHandler, g as getCookie, r as readBody } from '../../nitro/nitro.mjs';
import { apiClient } from './utils/apiClient.mjs';
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
  let body = await readBody(event);
  const { listId } = body;
  const response = await apiClient(
    "/grocery-list-item/index",
    {
      method: "POST",
      body: { listId }
    },
    token
  );
  return response;
});

export { index as default };
//# sourceMappingURL=index2.mjs.map
