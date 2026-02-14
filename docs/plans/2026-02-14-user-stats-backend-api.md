# User Stats Backend API - Implementation Plan

> **For Claude:** Dit plan is voor de backend API implementatie.

**Goal:** Maak een nieuw endpoint voor gebruikersstatistieken en voeg maand filtering toe aan alle admin stats endpoints.

**Tech Stack:** Laravel (aangenomen op basis van project structuur)

---

## Endpoint 1: User Stats (Nieuw)

**Route:** `GET /api/user/stats?month=YYYY-MM`

**Auth:** Vereist authenticatie (huidige gebruiker)

**Query Parameters:**
- `month` (optioneel): Maand in YYYY-MM formaat. Default: huidige maand.

**Response:**
```json
{
  "items": {
    "current_month": {
      "added": 42,
      "checked": 38,
      "period": "februari 2026"
    },
    "previous_month": {
      "added": 35,
      "checked": 30,
      "period": "januari 2026"
    },
    "change": {
      "absolute": 7,
      "percentage": 20
    }
  },
  "top_items": {
    "current_month": {
      "most_added": [
        { "name": "Melk", "count": 8 },
        { "name": "Brood", "count": 6 },
        { "name": "Eieren", "count": 5 },
        { "name": "Kaas", "count": 4 },
        { "name": "Boter", "count": 3 }
      ],
      "most_checked": [
        { "name": "Brood", "count": 12 },
        { "name": "Melk", "count": 10 },
        { "name": "Appels", "count": 8 },
        { "name": "Bananen", "count": 7 },
        { "name": "Yoghurt", "count": 6 }
      ]
    }
  },
  "available_months": ["2026-02", "2026-01", "2025-12", "2025-11", "2025-10"]
}
```

---

## Endpoint 2: Admin Stats - Alle endpoints moeten month parameter ondersteunen

De volgende admin stats endpoints moeten allemaal een optionele `?month=YYYY-MM` query parameter accepteren:

| Endpoint | Beschrijving |
|----------|--------------|
| `GET /api/admin/stats/users?month=YYYY-MM` | Gebruikersstatistieken (totaal, nieuw, actief, geverifieerd) |
| `GET /api/admin/stats/items?month=YYYY-MM` | Items statistieken (toegevoegd, afgevinkt) |
| `GET /api/admin/stats/lists?month=YYYY-MM` | Lijsten statistieken (aangemaakt, gedeeld) |
| `GET /api/admin/stats/activity?month=YYYY-MM` | Dagelijkse activiteit grafiek data |
| `GET /api/admin/stats/versions?month=YYYY-MM` | App versie distributie |
| `GET /api/admin/stats/top-items?month=YYYY-MM` | Top items (meest toegevoegd/afgevinkt) |
| `GET /api/admin/users/{id}?month=YYYY-MM` | User detail met items activity en top items |

**Gedrag:**
- Als `month` niet opgegeven: gebruik huidige maand
- Als `month` opgegeven: filter alle data op die specifieke maand
- `previous_month` in responses verwijst naar de maand VOOR de geselecteerde maand

---

## Database Queries (Pseudo-code)

### Items Added This Month
```sql
SELECT COUNT(*) as added
FROM items
WHERE user_id = :user_id
  AND created_at >= :month_start
  AND created_at < :month_end
```

### Items Checked This Month
```sql
SELECT COUNT(*) as checked
FROM items
WHERE user_id = :user_id
  AND checked_at >= :month_start
  AND checked_at < :month_end
  AND checked = true
```

### Top Added Items
```sql
SELECT name, COUNT(*) as count
FROM items
WHERE user_id = :user_id
  AND created_at >= :month_start
  AND created_at < :month_end
GROUP BY LOWER(name)
ORDER BY count DESC
LIMIT 5
```

### Top Checked Items
```sql
SELECT name, COUNT(*) as count
FROM items
WHERE user_id = :user_id
  AND checked_at >= :month_start
  AND checked_at < :month_end
  AND checked = true
GROUP BY LOWER(name)
ORDER BY count DESC
LIMIT 5
```

### Available Months
```sql
SELECT DISTINCT DATE_FORMAT(created_at, '%Y-%m') as month
FROM items
WHERE user_id = :user_id
ORDER BY month DESC
```

---

## Notes

- De frontend Nuxt routes proxyen naar deze endpoints
- Zorg dat de `period` string gelokaliseerd is (bijv. "februari 2026" voor NL)
- De `change.percentage` kan `null` zijn als previous_month 0 items heeft
- De frontend genereert de laatste 12 maanden als fallback als `available_months` niet beschikbaar is
