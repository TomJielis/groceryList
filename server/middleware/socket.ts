import { Server as SocketIOServer } from 'socket.io'

// Global Socket.io instance
let io: SocketIOServer | undefined

export default defineEventHandler(async (event) => {
  // Skip if this is not a socket.io request
  const url = event.node.req.url || ''
  if (!url.startsWith('/socket.io/')) {
    return // Let other handlers deal with it
  }

  // Initialize Socket.io server if not already done
  if (!io && event.node.res.socket?.server) {
    io = new SocketIOServer(event.node.res.socket.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      allowEIO3: true
    })

    io.on('connection', (socket) => {
      socket.on('join-list', (listId: number) => {
        socket.join(`list-${listId}`)
      })

      socket.on('leave-list', (listId: number) => {
        socket.leave(`list-${listId}`)
      })

      socket.on('list-updated', (data: { listId: number, userId: number }) => {
        socket.to(`list-${data.listId}`).emit('list-refresh', data)
      })

      socket.on('item-updated', (data: { listId: number, item: any }) => {
        socket.to(`list-${data.listId}`).emit('item-changed', data)
      })
    })
  }

  // Socket.io handles its own requests internally through the engine.io engine
  // We just need to prevent Nuxt from trying to handle these routes
  // Return empty response to satisfy h3
  event.node.res.statusCode = 200
  event.node.res.end()
})

