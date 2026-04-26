import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

let socket: Socket | null = null
const isConnected = ref(false)
const joinedRooms = new Set<number>()

export function useSocket() {
  const connect = () => {
    // If socket already exists (connecting or connected) reuse it — don't create a second one
    if (socket) {
      return socket
    }

    socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    })

    socket.on('connect', () => {
      isConnected.value = true
    })

    // After every reconnect: re-join all tracked rooms so other users' updates reach us again
    socket.on('reconnect', () => {
      joinedRooms.forEach(listId => {
        socket?.emit('join-list', listId)
      })
    })

    socket.on('disconnect', () => {
      isConnected.value = false
    })

    socket.on('connect_error', () => {
      isConnected.value = false
    })

    return socket
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
      isConnected.value = false
      joinedRooms.clear()
    }
  }

  const joinList = (listId: number) => {
    if (!socket) connect()

    // Track the room so we can re-join after reconnect
    joinedRooms.add(listId)

    if (socket && !socket.connected) {
      socket.once('connect', () => {
        socket?.emit('join-list', listId)
      })
    } else {
      socket?.emit('join-list', listId)
    }
  }

  const leaveList = (listId: number) => {
    joinedRooms.delete(listId)
    socket?.emit('leave-list', listId)
  }

  const notifyListUpdate = (listId: number, userId: number) => {
    if (!socket?.connected) return
    socket.emit('list-updated', { listId, userId })
  }

  const notifyItemUpdate = (listId: number, item: any) => {
    if (!socket?.connected) return
    socket.emit('item-updated', { listId, item })
  }

  const onListRefresh = (callback: (data: { listId: number, userId: number }) => void) => {
    socket?.on('list-refresh', callback)
  }

  const onItemChanged = (callback: (data: { listId: number, item: any }) => void) => {
    socket?.on('item-changed', callback)
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
