import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

let socket: Socket | null = null
const isConnected = ref(false)
const joinedRooms = new Set<number>()
// Week menus followed, joined again after every (re)connect
const joinedMenus = new Set<number>()

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

    // After every (re)connect: re-join all tracked rooms so other users' updates reach us again (a reconnect loses
    // the rooms on the server; socket.io v4 fires 'connect' again, its 'reconnect' event is the Manager's)
    socket.on('connect', () => {
      isConnected.value = true
      joinedRooms.forEach(listId => socket?.emit('join-list', listId))
      joinedMenus.forEach(menuId => socket?.emit('join-week-menu', menuId))
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
      joinedMenus.clear()
    }
  }

  const joinList = (listId: number) => {
    if (!socket) connect()

    // Track the room so we can re-join after reconnect
    joinedRooms.add(listId)
    // Not connected yet: the connect handler joins it
    if (socket?.connected) socket.emit('join-list', listId)
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

  // ----- Week menus: the others in the menu are told something changed, and fetch it again -----
  const joinWeekMenu = (menuId: number) => {
    if (!socket) connect()
    joinedMenus.add(menuId)
    if (socket?.connected) socket.emit('join-week-menu', menuId)
  }

  const leaveWeekMenu = (menuId: number) => {
    joinedMenus.delete(menuId)
    socket?.emit('leave-week-menu', menuId)
  }

  // Call after the API took the change
  // (also from a page that had no connection yet, like a recipe planned from its own page: sent once connected)
  const notifyWeekMenuUpdate = (menuId: number) => {
    if (!socket) connect()
    socket?.emit('week-menu-updated', { menuId })
  }

  const onWeekMenuRefresh = (callback: (data: { menuId: number }) => void) => {
    if (!socket) connect()
    socket?.on('week-menu-refresh', callback)
  }

  const offWeekMenuRefresh = (callback: (data: { menuId: number }) => void) => {
    socket?.off('week-menu-refresh', callback)
  }

  return {
    socket,
    joinWeekMenu,
    leaveWeekMenu,
    notifyWeekMenuUpdate,
    onWeekMenuRefresh,
    offWeekMenuRefresh,
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
