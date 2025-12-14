# Real-time Updates met Socket.io

## Hoe het werkt

Dit systeem gebruikt **Socket.io** voor real-time communicatie tussen gebruikers die dezelfde grocery list bekijken.

### Architectuur

```
User 1 (Browser)  <--WebSocket-->  Nuxt Server  <--WebSocket-->  User 2 (Browser)
                                    (Socket.io)
```

### Flow

1. **User 1** opent een grocery list (bijv. `/list/123`)
2. **Socket.io connectie** wordt gemaakt en User 1 joined room `list-123`
3. **User 2** opent dezelfde list en joined ook room `list-123`
4. **User 1** voegt een item toe:
   - Item wordt naar database gestuurd
   - Socket.io notificatie: `item-updated` wordt naar room `list-123` gestuurd
   - **User 2** ontvangt de notificatie en refresht de lijst automatisch
5. Real-time synchronisatie! ✨

### Implementatie Details

#### Server-side (`server/api/socket.ts`)
- Socket.io server wordt geïnitialiseerd via API endpoint
- Draait op dezelfde server als Nuxt
- Rooms per lijst: `list-{listId}`
- Events:
  - `join-list` - User joined lijst
  - `leave-list` - User verlaat lijst  
  - `list-updated` - Lijst is geüpdatet
  - `item-updated` - Item is aangepast

**Belangrijk:** De Socket.io server wordt automatisch geïnitialiseerd bij de eerste connectie.

#### Client-side (`composables/useSocket.ts`)
- WebSocket connectie naar Nuxt server
- Auto-reconnect bij connection loss
- Methods:
  - `connect()` - Maak connectie
  - `joinList(listId)` - Join lijst room
  - `leaveList(listId)` - Verlaat lijst room
  - `notifyItemUpdate(listId, item)` - Notify anderen over item update
  - `onListRefresh(callback)` - Luister naar lijst updates
  - `onItemChanged(callback)` - Luister naar item changes

#### Page Implementation (`pages/list/[id].vue`)
```typescript
// Connect en join room
onMounted(() => {
  connect();
  joinList(listId);
  
  // Luister naar updates
  onListRefresh(async (data) => {
    if (data.userId !== currentUser.id) {
      await fetchItems(listId); // Refresh lijst
    }
  });
});

// Cleanup
onBeforeUnmount(() => {
  leaveList(listId);
});
```

#### Composable Updates (`composables/useGroceryList.ts`)
Elke functie die items wijzigt stuurt een Socket.io notificatie:
```typescript
function checked(item) {
  // Update item in database
  $fetch('/api/item/checked', { body: item });
  
  // Notify andere users
  const { notifyItemUpdate } = useSocket();
  notifyItemUpdate(listId, item);
}
```

### Voordelen

✅ **Real-time updates** - Geen polling nodig
✅ **Efficiënt** - Alleen updates naar relevante users
✅ **Room-based** - Elke lijst heeft eigen room
✅ **Auto-reconnect** - Socket.io handelt disconnects af
✅ **Geen duplicates** - Only update als andere user wijziging maakte

### Testing

1. Open lijst in 2 browsers/tabs
2. Voeg item toe in tab 1
3. Tab 2 krijgt automatisch de update!

### Development

Start de development server:
```bash
npm run dev
```

Socket.io draait automatisch mee op dezelfde port als Nuxt.

### Production

Zorg dat WebSocket support enabled is in je hosting environment:
- Vercel: WebSockets supported ✅
- Netlify: Gebruik Netlify Functions ✅
- Custom server: Zorg dat WebSocket upgrades allowed zijn

### Troubleshooting

**Connectie werkt niet?**
- Check browser console voor Socket.io errors
- Verifieer dat `experimental.websocket: true` in nuxt.config.ts staat
- Check server logs voor Socket.io verbindingen

**Updates komen niet door?**
- Verifieer dat `notifyItemUpdate()` wordt aangeroepen na DB updates
- Check of users in dezelfde room zitten (console logs)
- Verifieer dat userId's verschillend zijn (anders wordt update geskipped)

