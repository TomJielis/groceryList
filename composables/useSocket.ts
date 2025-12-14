import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

let socket: Socket | null = null
const isConnected = ref(false)

export function useSocket() {
  const connect = () => {
    if (socket?.connected) {
      console.log('[Socket.io Client] Already connected:', socket.id)
      return socket
    }

    console.log('[Socket.io Client] Connecting to server...')

    // Connect to the Nuxt server - middleware will initialize Socket.io
    socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    })

    socket.on('connect', () => {
      console.log('[Socket.io Client] ✅ Connected! Socket ID:', socket?.id)
      isConnected.value = true
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket.io Client] ❌ Disconnected. Reason:', reason)
      isConnected.value = false
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket.io Client] ⚠️ Connection error:', error.message)
      isConnected.value = false
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket.io Client] 🔄 Reconnected after', attemptNumber, 'attempts')
    })

    return socket
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
      isConnected.value = false
    }
  }

  const joinList = (listId: number) => {
    if (!socket) connect()

    // Wait for connection before joining
    if (socket && !socket.connected) {
      socket.once('connect', () => {
        socket?.emit('join-list', listId)
        console.log('[Socket.io Client] 📥 Joining list:', listId)
      })
    } else {
      socket?.emit('join-list', listId)
      console.log('[Socket.io Client] 📥 Joining list:', listId)
    }
  }

  const leaveList = (listId: number) => {
    socket?.emit('leave-list', listId)
    console.log('[Socket.io Client] 📤 Leaving list:', listId)
  }

  const notifyListUpdate = (listId: number, userId: number) => {
    if (!socket?.connected) {
      console.warn('[Socket.io Client] ⚠️ Cannot notify - not connected')
      return
    }
    socket.emit('list-updated', { listId, userId })
    console.log('[Socket.io Client] 🔔 Notified list update:', { listId, userId })
  }

  const notifyItemUpdate = (listId: number, item: any) => {
    if (!socket?.connected) {
      console.warn('[Socket.io Client] ⚠️ Cannot notify - not connected')
      return
    }
    socket.emit('item-updated', { listId, item })
    console.log('[Socket.io Client] 🔔 Notified item update:', { listId, itemId: item.id })
  }

  const onListRefresh = (callback: (data: { listId: number, userId: number }) => void) => {
    socket?.on('list-refresh', (data) => {
      console.log('[Socket.io Client] 📬 Received list-refresh:', data)
      callback(data)
    })
  }

  const onItemChanged = (callback: (data: { listId: number, item: any }) => void) => {
    socket?.on('item-changed', (data) => {
      console.log('[Socket.io Client] 📬 Received item-changed:', data)
      callback(data)
    })
  }

  const offListRefresh = (callback: any) => {
    socket?.off('list-refresh', callback)
  }

  const offItemChanged = (callback: any) => {
    socket?.off('item-changed', callback)
  }

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    joinList,
    leaveList,
    notifyListUpdate,
    notifyItemUpdate,
    onListRefresh,
    onItemChanged,
    offListRefresh,
    offItemChanged,
  }
}

