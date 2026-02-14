# Swipe Actions voor Grocery List Items

## Doel

De list items user-friendly maken met swipe gestures voor snelle acties, grotere touch targets, en betere mobiele UX.

## Huidige Problemen

- Te veel clicks nodig voor basis acties (afvinken, bewerken)
- Touch targets te klein voor mobiel gebruik
- Geen swipe acties beschikbaar

## Design

### Swipe Interacties

| Richting | Actie | Visuele Feedback |
|----------|-------|------------------|
| Links swipen | Item afvinken/unchecken | Groene achtergrond met checkmark |
| Rechts swipen | Edit mode openen | Blauwe achtergrond met edit icoon |

- **Swipe threshold**: 80px voordat actie triggert
- **Spring-back animatie**: Item keert terug naar originele positie na actie

### Touch Targets

| Element | Huidig | Nieuw |
|---------|--------|-------|
| Checkbox tap area | 24x24px | 48x48px |
| Item row | Content only | Hele rij tappable |

### Item Layout

Compact layout behouden:
```
┌─────────────────────────────────────────┐
│ [✓]  Melk          2x • €1.50    €3.00 │
└─────────────────────────────────────────┘
```

### Checked Items Weergave

- Doorgestreepte tekst
- Opacity 60%
- Zelfde swipe functionaliteit (swipe links om te unchecken)

### Desktop Fallback

Op desktop (geen touch):
- Hover reveal: action buttons verschijnen rechts
- Click op checkbox voor check/uncheck
- Click op item voor edit

## Technische Aanpak

- Pure CSS transforms + Vue touch events (geen externe library)
- Behoud alle bestaande functionaliteit en emits
- Touch events: touchstart, touchmove, touchend
- CSS transitions voor smooth animaties

## Scope

### In scope
- Swipe gestures voor check/edit
- Grotere touch targets
- Smooth animaties
- Desktop fallback met hover buttons

### Buiten scope
- Externe swipe libraries
- Delete swipe actie (blijft via edit mode)
- Quantity wijzigen via swipe

## Bestanden

- `components/list/groceryListItem.vue` - Hoofdwijzigingen
