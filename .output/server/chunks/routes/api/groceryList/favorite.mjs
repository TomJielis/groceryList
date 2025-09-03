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

const favorite = defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  const body = await readBody(event);
  const { id } = body;
  try {
    const response = await apiClient(
      "/grocery-list/" + id + "/favorite",
      {
        method: "POST"
      },
      token
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
});

export { favorite as default };
//# sourceMappingURL=favorite.mjs.map
