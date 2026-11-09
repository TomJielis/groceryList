import { Server as SocketIOServer } from 'socket.io'
import { apiClient } from '~/server/api/utils/apiClient'

// Global Socket.io instance
let io: SocketIOServer | undefined

// A list the user only just got is looked up again, but not more than this often per connection
const LOOKUP_INTERVAL_MS = 1000

// The app sends its login token when connecting, the website has it in the login cookie
function loginToken(handshake: { auth?: Record<string, unknown>, headers: { cookie?: string } }): string | undefined {
  if (typeof handshake.auth?.token === 'string') return handshake.auth.token
  const cookie = handshake.headers.cookie?.match(/(?:^|;\s*)token=([^;]+)/)?.[1]
  return cookie ? decodeURIComponent(cookie) : undefined
}

// Whether the user of a connection is on a list, according to the API. Without a valid login: never, so an app that
// doesn't send its token yet keeps working, it just gets its updates when it refreshes.
function createListAccess(token: string | undefined) {
  let listIds = new Set<number>()
  let lookup: Promise<void> | null = null
  let lastLookup = 0

  const refresh = () => {
    if (lookup) return lookup
    if (Date.now() - lastLookup < LOOKUP_INTERVAL_MS) return Promise.resolve()
    lastLookup = Date.now()
    lookup = apiClient('/grocery-list/index', { method: 'GET' }, token)
      .then((response) => {
        listIds = new Set((response.data as unknown as { id: number }[]).map((list) => Number(list.id)))
      })
      .catch(() => {
        listIds = new Set()
      })
      .finally(() => {
        lookup = null
      })
    return lookup
  }

  return async (listId: number): Promise<boolean> => {
    if (!token || !Number.isInteger(listId)) return false
    if (listIds.has(listId)) return true
    await refresh()
    return listIds.has(listId)
  }
}

export default defineEventHandler(async (event) => {
  // Skip if this is not a socket.io request
  const url = event.node.req.url || ''
  if (!url.startsWith('/socket.io/')) {
    return // Let other handlers deal with it
  }

  // Initialize Socket.io server if not already done
  if (!io && event.node.res.socket?.server) {
    io = new SocketIOServer(event.node.res.socket.server, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      allowEIO3: true
    })

    io.on('connection', (socket) => {
      const mayAccess = createListAccess(loginToken(socket.handshake))

      socket.on('join-list', async (listId: number) => {
        if (await mayAccess(Number(listId))) socket.join(`list-${Number(listId)}`)
      })

      socket.on('leave-list', (listId: number) => {
        socket.leave(`list-${listId}`)
      })

      // Only the signal that something changed goes along: everyone refetches what they may see from the API
      socket.on('list-updated', async (data: { listId: number }) => {
        const listId = Number(data?.listId)
        if (await mayAccess(listId)) socket.to(`list-${listId}`).emit('list-refresh', { listId })
      })

      socket.on('item-updated', async (data: { listId: number }) => {
        const listId = Number(data?.listId)
        if (await mayAccess(listId)) socket.to(`list-${listId}`).emit('item-changed', { listId, item: null })
      })
    })
  }

  // Socket.io handles its own requests internally through the engine.io engine
  // We just need to prevent Nuxt from trying to handle these routes
  // Return empty response to satisfy h3
  event.node.res.statusCode = 200
  event.node.res.end()
})

