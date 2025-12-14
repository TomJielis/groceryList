# Socket.io Test Checklist

## Stappen om te testen:

1. **⚠️ BELANGRIJK: Herstart de development server**
   ```bash
   # Stop de server (Ctrl+C)
   npm run dev
   ```
   Dit is nodig omdat de Socket.io middleware geïnitialiseerd moet worden!

2. **Open de browser console** (F12)

3. **Open lijst in TAB 1**
   - Ga naar `http://localhost:3000/list/1`
   - Check console logs:
     ```
     [Socket.io Client] Connecting to server...
     [Socket.io Client] ✅ Connected! Socket ID: xyz
     [List Page] Setting up Socket.io connection for list: 1
     [Socket.io Client] 📥 Joining list: 1
     [List Page] ✅ Event listeners registered
     ```

4. **Open lijst in TAB 2 (zelfde lijst!)**
   - Ga naar `http://localhost:3000/list/1`
   - Check console logs (zelfde als tab 1)

5. **Voeg item toe in TAB 1**
   - Klik op "Add Item"
   - Voeg bijv. "Melk" toe
   - Check console in TAB 1:
     ```
     [Socket.io Client] 🔔 Notified item update: { listId: 1, itemId: 123 }
     ```
   - Check console in TAB 2:
     ```
     [Socket.io Client] 📬 Received item-changed: { listId: 1, item: {...} }
     [List Page] 📬 Item changed by another user
     [List Page] 🔄 Refreshing items...
     ```
   - **"Melk" zou nu zichtbaar moeten zijn in TAB 2!** ✅

6. **Check item aan in TAB 2**
   - Klik op checkbox van een item
   - Check console in TAB 2:
     ```
     [Socket.io Client] 🔔 Notified item update
     ```
   - Check console in TAB 1:
     ```
     [Socket.io Client] 📬 Received item-changed
     [List Page] 🔄 Refreshing items...
     ```
   - **Item zou checked moeten zijn in TAB 1!** ✅

## Server Logs

Check ook de terminal waar `npm run dev` draait:

```
[Socket.io] ✅ Client connected: socket_id_1
[Socket.io] 📥 Client socket_id_1 joined list-1
[Socket.io] ✅ Client connected: socket_id_2
[Socket.io] 📥 Client socket_id_2 joined list-1
[Socket.io] 🔔 Broadcasting item update to list: 1
```

## Troubleshooting

### Socket.io verbindt niet
- ❌ Check of er errors in console zijn
- ✅ Herstart development server
- ✅ Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### Updates komen niet door
- ❌ Check of beide tabs in DEZELFDE lijst zitten (zelfde listId)
- ✅ Check console logs - zie je de "Broadcasting" messages?
- ✅ Check of userId's verschillend zijn tussen tabs

### Items worden niet toegevoegd
- ❌ Check of de API call succesvol is (Network tab)
- ✅ Check of `notifyItemUpdate()` wordt aangeroepen na API success

## Verwachte Flow

```
TAB 1: Add "Melk"
  ↓
API: POST /api/groceryListItem/store
  ↓
Socket: emit('item-updated', { listId: 1, item: {...} })
  ↓
Socket Server: broadcast to room 'list-1'
  ↓
TAB 2: receives 'item-changed' event
  ↓
TAB 2: fetchItems(1) - refresh lijst
  ↓
TAB 2: "Melk" verschijnt! ✅
```

