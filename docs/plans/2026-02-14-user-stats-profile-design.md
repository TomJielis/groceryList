# User Statistics on Profile Page - Design Document

## Overview

Gebruikers kunnen hun eigen item statistieken en top items inzien via een nieuwe statistieken pagina, toegankelijk vanaf het profiel. Admins krijgen ook een link naar het admin dashboard op de profielpagina.

## Requirements

1. **Items Activity** - Toon toegevoegde/afgevinkte items per maand
2. **Top Items** - Toon meest toegevoegde en afgevinkte items
3. **Maand selector** - Wissel tussen maanden (zowel user als admin)
4. **Admin link** - Knop naar admin dashboard (alleen voor admins)

## Data Structuur

### API Endpoint

`GET /api/user/stats?month=2026-02` (month optioneel, default = huidige maand)

```typescript
{
  items: {
    current_month: { added: number, checked: number, period: string },
    previous_month: { added: number, checked: number, period: string },
    change: number // percentage verschil
  },
  top_items: {
    current_month: {
      most_added: Array<{ name: string, count: number }>,
      most_checked: Array<{ name: string, count: number }>
    }
  },
  available_months: string[] // bijv. ["2026-02", "2026-01", "2025-12", ...]
}
```

## Frontend Componenten

### Nieuwe componenten

1. **`components/profile/MonthSelector.vue`**
   - Herbruikbare maand selector met pijltjes of dropdown
   - Props: `selectedMonth`, `availableMonths`
   - Emit: `@change`

2. **`components/profile/ProfileItemsActivity.vue`**
   - Items statistieken kaart
   - Toont: added/checked deze maand, vorige maand, verandering %
   - Hergebruikt `AdminStatsCard` component

3. **`components/profile/ProfileTopItems.vue`**
   - Top items lijsten
   - Toont: top 5 meest toegevoegde en afgevinkte items
   - Zelfde styling als admin pagina

4. **`components/profile/AdminSection.vue`**
   - Alleen zichtbaar voor admins (`authStore.user.is_admin`)
   - Link naar `/admin`

### Nieuwe pagina

**`pages/profile/stats.vue`**
- MonthSelector bovenaan
- Items Activity sectie
- Top Items sectie
- Terug link naar profiel

### Aanpassingen bestaande bestanden

**`pages/profile.vue`**
- Nieuwe sectie: "Mijn Statistieken" knop -> navigeert naar `/profile/stats`
- Nieuwe sectie: Admin link (alleen voor admins)

**`pages/admin/users/[id].vue`**
- MonthSelector toevoegen boven Items Activity
- Data herladen bij maand wijziging

**`composables/useAdminApi.ts`**
- `getUserDetail(id, month?)` - month parameter toevoegen

### Nieuwe composable

**`composables/useUserStats.ts`**
```typescript
export function useUserStats() {
  async function getStats(month?: string) {
    const params = month ? `?month=${month}` : '';
    const response = await fetch(`/api/user/stats${params}`);
    return await response.json();
  }
  return { getStats }
}
```

## Pagina Structuur

### Profielpagina (`pages/profile.vue`)

1. Profile Information (bestaand)
2. Pending Lists (bestaand)
3. **Mijn Statistieken knop** (nieuw)
4. Language Settings (bestaand)
5. Account Actions (bestaand)
6. **Admin Sectie** (nieuw, alleen admins)

### Statistieken pagina (`pages/profile/stats.vue`)

1. Header met terug link
2. MonthSelector
3. Items Activity (3 kaarten)
4. Top Items (2 lijsten)

## Backend Wijzigingen

Dit design vereist een nieuw backend endpoint. Zie apart plan document voor API implementatie.

### Benodigde backend endpoints

1. **Nieuw:** `GET /api/user/stats?month=YYYY-MM`
   - Retourneert items activity en top items voor ingelogde user
   - Retourneert available_months array

2. **Aanpassing:** `GET /admin/users/{id}?month=YYYY-MM`
   - Month parameter toevoegen voor maand filtering
