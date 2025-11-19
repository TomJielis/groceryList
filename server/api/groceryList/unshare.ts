import {readBody, getCookie} from 'h3'
import {apiClient} from "~/server/api/utils/apiClient";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const body = await readBody(event)
  const { id, userId } = body
  if (!id || !userId) {
    throw new Error('Missing list id or user id for unshare')
  }
  try {
    // Assuming backend expects groceryListId + userId
    const response = await apiClient('/grocery-list/unshare', {
      method: 'POST',
      body: { groceryListId: id, userId: userId }
    }, token)
    return response
  } catch (error) {
    throw new Error(`Failed to unshare list: ${error}`)
  }
})

