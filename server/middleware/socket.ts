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

// Whether the user of a connection is in a list (or week menu: endpoint), according to the API. Without a valid
// login: never, so an app that doesn't send its token yet keeps working, it just gets its updates when it refreshes.
// A positive answer is kept for the connection until forget() (leaving the room); an id not known is looked up again,
// waiting for the interval instead of answering "no" from an older lookup (a menu made or joined just now).
function createAccess(token: string | undefined, endpoint: string) {
  let listIds = new Set<number>()
  let lookup: Promise<void> | null = null
  let lastLookup = 0

  const refresh = async (): Promise<void> => {
    if (lookup) return lookup
    const wait = LOOKUP_INTERVAL_MS - (Date.now() - lastLookup)
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
    if (lookup) return lookup
    lastLookup = Date.now()
    lookup = apiClient(endpoint, { method: 'GET' }, token)
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

  const may = async (listId: number): Promise<boolean> => {
    if (!token || !Number.isInteger(listId)) return false
    if (listIds.has(listId)) return true
    await refresh()
    return listIds.has(listId)
  }
  // Out of the room (left, removed, or the menu is gone): asked again next time
  const forget = (listId: number) => listIds.delete(listId)

  return { may, forget }
}

// At most one signal per menu per this many ms from one connection; a burst (+ + +) ends with one more signal, so the
// last change is never missed
const SIGNAL_INTERVAL_MS = 500

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
      const token = loginToken(socket.handshake)
      const mayAccess = createAccess(token, '/grocery-list/index').may
      // Week menus the same way: only someone in the menu follows it (older apps never ask)
      const menuAccess = createAccess(token, '/week-menus/index')

      socket.on('join-week-menu', async (menuId: number) => {
        if (await menuAccess.may(Number(menuId))) socket.join(`week-menu-${Number(menuId)}`)
      })

      socket.on('leave-week-menu', (menuId: number) => {
        socket.leave(`week-menu-${Number(menuId)}`)
        menuAccess.forget(Number(menuId))
      })

      // Someone planned, moved, changed or put dishes on a list: the others fetch the week again from the API
      const lastSignal = new Map<number, number>()
      const trailing = new Map<number, ReturnType<typeof setTimeout>>()
      const signal = (menuId: number) => {
        lastSignal.set(menuId, Date.now())
        socket.to(`week-menu-${menuId}`).emit('week-menu-refresh', { menuId })
      }
      socket.on('week-menu-updated', async (data: { menuId: number }) => {
        const menuId = Number(data?.menuId)
        if (!(await menuAccess.may(menuId))) return
        const wait = SIGNAL_INTERVAL_MS - (Date.now() - (lastSignal.get(menuId) ?? 0))
        if (wait <= 0) return signal(menuId)
        if (trailing.has(menuId)) return
        trailing.set(menuId, setTimeout(() => {
          trailing.delete(menuId)
          signal(menuId)
        }, wait))
      })
      socket.on('disconnect', () => {
        trailing.forEach(timer => clearTimeout(timer))
        trailing.clear()
      })

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

