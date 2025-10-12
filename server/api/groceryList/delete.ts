import {readBody} from 'h3'
import { getCookie } from 'h3'
import {apiClient} from "../utils/apiClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {id} = body
  const token = getCookie(event, 'token')

  try {
    const response = await apiClient('/grocery-list/' + id + '/delete',
        {
          method: 'DELETE',
        }, token);


    return response;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
});