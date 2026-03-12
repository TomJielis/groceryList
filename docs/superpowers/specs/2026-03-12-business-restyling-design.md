# Design Spec: Business Restyling — GroceryList App

**Date:** 2026-03-12
**Branch:** primevue
**Scope:** Volledige app — alle 18 pagina's en 28 componenten

---

## Overzicht

De volledige app wordt visueel omgezet naar een business-applicatie stijl. **Alleen styling verandert** — geen gedrag, geen logica, geen vertalingen. Alle v-model bindings, event handlers, PrimeVue component props en conditionele logica blijven intact.

Kernprincipes:
1. **PrimeVue custom preset als centrale styling bron** — alle kleuren en design tokens op één plek in `assets/theme/business.ts`
2. **Maximaal gebruik van PrimeVue componenten** — vervangt custom div-structuren waar zinvol
3. **Tailwind alleen voor layout** — `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*` en responsive breakpoints; geen kleur- of border-klassen meer in templates
4. **Custom CSS via CSS variabelen** — `assets/css/app-theme.css` en templates gebruiken uitsluitend `var(--p-*)` of `var(--app-*)` tokens; geen hardcoded hexwaarden. Uitzondering: `assets/theme/business.ts` is de token-definitie zelf en mag hexwaarden bevatten.

---

## Design richting

Geselecteerd via visuele mockup review (Option A — Business met karakter):

- **Pagina achtergrond:** `#f0f4f8` (lichtgrijs)
- **Auth pagina achtergrond:** `#e8ecf2` (iets donkerder grijs — eigen CSS variabele)
- **Kaarten/panels:** `#ffffff`, schaduw, border-radius 4px
- **Topbar:** `#1e3a5f` (donkerblauw)
- **Primaire kleur:** `#f97316` (oranje), hover `#ea580c`
- **Primaire tekst:** `#0f172a`
- **Secundaire tekst:** `#64748b`
- **Muted tekst:** `#94a3b8`
- **Borders:** `#e2e8f0`
- **Font:** DM Sans (behouden)

---

## Design tokens

| Naam | Waarde | Gebruik |
|---|---|---|
| `--app-bg` | `#f0f4f8` | Body / pagina achtergrond |
| `--app-bg-auth` | `#e8ecf2` | Auth pagina's achtergrond |
| `--app-navy` | `#1e3a5f` | Topbar, navbar, checkbox checked, focus borders |
| `--app-navy-dark` | `#16304f` | Checkbox hover achtergrond |
| `--p-primary-color` | `#f97316` | Primaire knoppen, progress bars (via preset) |
| `--p-primary-hover-color` | `#ea580c` | Hover staat primaire knoppen (via preset) |
| `--p-surface-0` | `#ffffff` | Kaarten, rows, modals |
| `--p-surface-50` | `#f8fafc` | Tabel headers, input achtergrond |
| `--p-surface-200` | `#e2e8f0` | Alle borders |
| `--p-surface-500` | `#64748b` | Secundaire tekst |
| `--p-surface-900` | `#0f172a` | Primaire tekst |
| `--app-success` | `#10b981` | Successtaten, voltooide items |
| `--app-error` | `#ef4444` | Validatiefouten |
| `--app-warning` | `#f59e0b` | Waarschuwingen (NotificationBar) |
| `--app-info` | `#3b82f6` | Informatie notificaties |

`--p-*` tokens worden automatisch gegenereerd door de PrimeVue preset. `--app-*` tokens worden handmatig gedefinieerd in `app-theme.css`.

---

## Architectuur: bestanden

### `assets/theme/business.ts` (nieuw)

Custom PrimeVue preset via `definePreset(Aura, {...})`. Bevat alle kleur- en stijloverrides. Geïmporteerd in `nuxt.config.ts` ter vervanging van de directe Aura import.

```ts
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

export default definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
      400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
      800: '#9a3412', 900: '#7c2d12', 950: '#431407'
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff', 50:  '#f8fafc', 100: '#f1f5f9',
          200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
          500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a', 950: '#020617'
        },
        primary: {
          color:         '#f97316',
          contrastColor: '#ffffff',
          hoverColor:    '#ea580c',
          activeColor:   '#c2410c'
        },
        highlight: {
          background:      '#fff7ed',
          focusBackground: '#ffedd5',
          color:           '#c2410c',
          focusColor:      '#9a3412'
        }
      }
    },
    // Gedeelde form field tokens — worden geërfd door InputText, Select, etc.
    formField: {
      borderRadius: '4px',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: '0 0 0 3px rgba(30,58,95,0.12)'
      }
    }
  },
  components: {
    button: {
      root: {
        borderRadius: '4px',
        paddingX: '1rem',
        paddingY: '0.6rem',
        sm: { fontSize: '0.75rem', paddingX: '0.75rem', paddingY: '0.45rem' }
      }
    },
    inputtext: {
      root: {
        borderColor:       '{surface.300}',
        hoverBorderColor:  '{surface.400}',
        focusBorderColor:  '#1e3a5f',
        background:        '{surface.50}',
        color:             '{surface.900}',
        placeholderColor:  '{surface.400}',
        borderRadius:      '4px'
      }
    },
    select: {
      root: {
        borderColor:      '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#1e3a5f',
        background:       '{surface.50}',
        borderRadius:     '4px'
      }
    },
    checkbox: {
      root: {
        borderColor:           '{surface.300}',
        checkedBackground:     '#1e3a5f',
        checkedBorderColor:    '#1e3a5f',
        checkedHoverBackground:'#16304f',
        borderRadius:          '3px'
      },
      icon: {
        checkedColor: '#ffffff'
      }
    },
    card: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
      }
    },
    dialog: {
      root: {
        background:   '{surface.0}',
        color:        '{surface.900}',
        borderRadius: '4px',
        shadow:       '0 8px 32px rgba(0,0,0,0.12)'
      }
    },
    progressbar: {
      root: {
        background:   '{surface.200}',
        borderRadius: '2px',
        height:       '4px'
      },
      value: {
        background: '{primary.color}'
      }
    },
    // DataTable heeft geen root-wrapper — tokens zitten direct op headerCell, row, bodyCell
    datatable: {
      headerCell: {
        background:  '{surface.50}',
        color:       '{surface.500}',
        borderColor: '{surface.200}'
      },
      row: {
        background:      '{surface.0}',
        hoverBackground: '{surface.50}',
        borderColor:     '{surface.100}'
      },
      bodyCell: {
        borderColor: '{surface.100}'
      }
    }
  }
})
```

### `assets/css/app-theme.css` (nieuw)

Bevat custom styles buiten PrimeVue: Navbar, BottomBar, auth card header, pagina achtergronden. Uitsluitend CSS variabelen — geen hardcoded kleuren.

```css
:root {
  --app-bg: #f0f4f8;
  --app-bg-auth: #e8ecf2;
  --app-navy: #1e3a5f;
  --app-success: #10b981;
  --app-error: #ef4444;
  --app-warning: #f59e0b;
  --app-info: #3b82f6;
}

body { background: var(--app-bg); color: var(--p-surface-900); }

.app-navbar { background: var(--app-navy); }
.app-navbar-link { color: rgba(255,255,255,0.6); }
.app-navbar-link:hover, .app-navbar-link.active { color: #fff; background: rgba(255,255,255,0.1); }

.app-bottombar { background: var(--p-surface-0); border-top: 1px solid var(--p-surface-200); }
.app-bottombar-tab { color: var(--p-surface-400); }
.app-bottombar-tab.active { color: var(--app-navy); }

.auth-page { background: var(--app-bg-auth); }
.auth-card-header { background: var(--app-navy); color: #fff; }

.stat-card-accent-orange { border-left: 3px solid var(--p-primary-color); }
.stat-card-accent-blue   { border-left: 3px solid var(--app-info); }
.stat-card-accent-green  { border-left: 3px solid var(--app-success); }
```

### `nuxt.config.ts` wijziging

```ts
// Vervang:
import Aura from '@primevue/themes/aura'
// Door:
import BusinessPreset from './assets/theme/business'

// In primevue config:
primevue: {
  options: {
    ripple: true,
    theme: { preset: BusinessPreset }
  }
}

// Voeg toe aan css array:
css: ['@/assets/css/tailwind.css', '@/assets/css/main.css', '@/assets/css/app-theme.css', 'primeicons/primeicons.css']
```

---

## Tailwind gebruik na restyling

| Gebruik | Toegestaan |
|---|---|
| Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `min-h-*` | ✅ |
| Responsive: `md:`, `lg:` breakpoints | ✅ |
| `hidden`, `block`, `items-center`, `justify-*`, `overflow-*` | ✅ |
| Kleur classes: `bg-[#...]`, `text-[#...]`, `border-[#...]` | ❌ vervangen door CSS variabelen of preset |
| PrimeVue component styling via Tailwind | ❌ via preset of `pt` |

---

## Componenten — gedetailleerde wijzigingen

Alle PrimeVue componenten: **`unstyled` prop verwijderen**, `pt` overrides die kleur/border/achtergrond sturen verwijderen. Structurele `pt` keys (positie, display) blijven intact.

---

### Navbar.vue
- CSS class `app-navbar` toevoegen (donkerblauw via `app-theme.css`)
- Nav links: class `app-navbar-link` + `app-navbar-link active` op actieve link
- Logo: oranje dot element toevoegen (`background: var(--p-primary-color)`)
- Taal dropdown: `Select` component (PrimeVue) — vervangt huidige implementatie

### BottomBar.vue
- CSS class `app-bottombar` toevoegen
- Tab items: class `app-bottombar-tab` + `.active` op actieve tab
- Structuur (custom nav buttons) blijft — geen PrimeVue TabMenu (te complex voor huidige navigatielogica)

### NotificationBar.vue
- Kleuren via CSS variabelen: success → `--app-success`, error → `--app-error`, warning → `--app-warning`, info → `--app-info`
- Inline hardcoded kleuren vervangen

### Loader.vue
- `ProgressSpinner` (PrimeVue) vervangt huidige spinner
- Kleur via preset primary

---

### Auth pagina's: login.vue, register.vue, password/reset.vue, password/[id].vue, auth/[id].vue

Alle vijf auth pagina's krijgen dezelfde behandeling:
- Pagina wrapper: class `auth-page` (achtergrond via `app-theme.css`)
- Kaartstructuur: `Card` component met custom header slot (class `auth-card-header`)
- Inputs: `InputText`, `Password` — `unstyled` verwijderen, `pt` kleur-overrides verwijderen
- Knoppen: `Button` — `unstyled` verwijderen; primary = oranje (default), secondary = outlined
- `SelectButton` (taalwisseling): `unstyled` + `pt` verwijderen
- `Checkbox` (terms): `unstyled` + `pt` verwijderen

---

### pages/index.vue (Dashboard)

- Pagina achtergrond: inline stijl verwijderen → body background via `app-theme.css`
- Tabel wrapper: `Card` component (PrimeVue)
- `DataTable` (PrimeVue, al in gebruik): `unstyled`/`pt` kleur-overrides verwijderen; styling via preset
- Progress bars: `ProgressBar` component — `unstyled` verwijderen
- Actie knoppen: `Button` text/outlined severity
- Nieuwe lijst knop: `Button` severity="primary"

### pages/list/[id].vue (Lijstdetail)

- Stat blokken: witte `div` + CSS class `stat-card-accent-orange/blue/green` (geen `Card` — te veel padding voor compacte weergave)
- Item rijen: witte `div` met `box-shadow: 0 1px 2px rgba(0,0,0,0.05)` via CSS class — `Checkbox` component (checked = navy via preset)
- Afgevinkte items: `opacity: 0.6` + `line-through` (ongewijzigd gedrag)
- `ProgressBar`: `unstyled` verwijderen
- "Item toevoegen" knop: `Button` severity="primary"
- Terugknop (`backButton`): `Button` text variant

### components/list/groceryListItem.vue

- Checkbox: `Checkbox` component — `unstyled` + `pt` verwijderen
- Inline kleur-classes vervangen door CSS variabelen
- Layout (grid/flex) Tailwind classes behouden

### components/list/ListForm.vue

- Inputs: `InputText` — `unstyled` verwijderen
- Knoppen: `Button` primary/secondary
- Inline kleuren vervangen

### components/list/AddItemListForm.vue

- Zoek input: `InputText`
- Knoppen: `Button`
- Items tabel: `DataTable` of gestylde rows via preset/CSS variabelen

### components/list/PendingGroceryList.vue

- Lijst items: `Card` of gestylde rows
- Accept/decline knoppen: `Button` severity="success"/"danger"

### components/list/SharedUsersList.vue

- Inline kleur-classes vervangen door CSS variabelen

### components/dashboard/cards.vue

- Card items: `Card` component (PrimeVue)
- Delete knop: `Button` severity="danger" text variant
- View knop: `Button` severity="secondary"

---

### Modals: deleteModal.vue, ShareListModal.vue, DeleteListModal.vue

Alle drie omzetten naar `Dialog` component (PrimeVue):
- `Dialog` met `:visible` binding (gedrag ongewijzigd)
- `InputText` voor tekstveld validatie (delete confirmatieveld)
- `Button` severity="danger" voor bevestiging, "secondary" voor annuleren
- Overlay achtergrond via preset

### components/profile/DeactivateAccountModal.vue

- Zelfde behandeling als bovenstaande modals
- `Dialog` component, `InputText`, `Button` severity="danger"

---

### pages/profile/index.vue + sub-componenten

**profile/index.vue (pagina shell)**
- Pagina wrapper: Tailwind layout classes behouden, inline kleur-classes → CSS variabelen
- Sectie headers (eyebrow tekst, titels): inline kleur-classes → `var(--p-surface-*)` tokens
- `Card` wrapper toevoegen rondom de secties (ProfileInformation, AccountActions, etc.)

**ProfileInformation.vue**
- Display mode: `Card` wrapper, inline kleur-classes → CSS variabelen
- Edit mode: `InputText` — `unstyled` verwijderen

**LanguageSettings.vue**
- `SelectButton` — `unstyled` + `pt` verwijderen

**AccountActions.vue**
- Logout: `Button` severity="secondary"
- Deactiveren: `Button` severity="danger"

**MonthSelector.vue**
- `Select` component — `unstyled` + `pt` verwijderen

**ProfileItemsActivity.vue**
- `Card` wrapper
- Chart.js kleuren: primary series = `#f97316`, secondary = `#1e3a5f`

**ProfileTopItems.vue**
- `Card` wrapper
- Tabel rows: inline kleur-classes → CSS variabelen

### pages/profile/stats.vue

- `Card` wrapper voor secties
- `MonthSelector` (al aangepakt)
- Grafiek kleuren: `#f97316`, `#1e3a5f`, `#10b981`
- Tabel rows: inline kleur-classes → CSS variabelen

---

### pages/cards/index.vue

- `dashboard/cards.vue` component (al aangepakt boven)
- Pagina achtergrond via body

### pages/cards/upload.vue + CardUploadPanel.vue

- Bestaande upload structuur behouden — **geen** swap naar PrimeVue `FileUpload` (te veel gedragsrisico)
- Inline kleur-classes → CSS variabelen
- `Button` severity="primary" voor upload actie

---

### pages/admin/index.vue

- **AdminStatsCard.vue**: `Card` + CSS class `stat-card-accent-*`
- **AdminLineChart.vue**: chart.js kleuren updaten — added series = `#f97316`, checked series = `#1e3a5f`
- **AdminDoughnutChart.vue**: chart.js kleurarray — `['#f97316', '#1e3a5f', '#10b981', '#94a3b8']`
- **DataTable** (PrimeVue): `pt` kleur-overrides verwijderen
- Knoppen: `Button`

### pages/admin/top-items.vue

- Maand toggle knoppen: `SelectButton` (PrimeVue)
- Tabel kolommen: inline kleur-classes → CSS variabelen

### pages/admin/users/index.vue

- `DataTable` styling via preset
- `Button` voor acties

### pages/admin/users/[id].vue

- `Card` wrappers voor secties
- Inline kleur-classes → CSS variabelen

---

### pages/information.vue

- Feature blokken: `Card` component
- CTA knop: `Button` severity="primary"
- Inline kleuren → CSS variabelen

### pages/terms/index.vue

- `Card` wrapper
- Inline kleuren → CSS variabelen

### pages/terms/approve.vue

- `Card` wrapper
- `Checkbox` — `unstyled` + `pt` verwijderen
- `Button` severity="primary"

---

### Gedeelde form/ componenten

**form/formInput.vue**
- `InputText` component — `unstyled` verwijderen

**form/addButton.vue**
- `Button` severity="primary"

**form/backButton.vue**
- `Button` text variant of link variant

### components/DataTable.vue (custom wrapper)

Dit is een **custom wrapper** rondom PrimeVue's `DataTable`. De wrapper zelf krijgt geen extra styling:
- Inline `bg-[#...]`, `text-[#...]`, `border-[#...]` kleurklassen in de wrapper template verwijderen
- Eventuele `pt` passthrough props die kleur/achtergrond aansturen verwijderen
- De binnenste PrimeVue `DataTable` wordt automatisch gestyled via de preset
- Layout Tailwind classes (grid, flex, gap, padding) behouden

---

## Implementatie volgorde

1. `assets/theme/business.ts` — preset aanmaken
2. `assets/css/app-theme.css` — custom CSS aanmaken
3. `nuxt.config.ts` — preset en CSS importeren
4. `app.vue` — inline body stijlen verwijderen (body styled via `app-theme.css`)
5. Gedeelde form/ componenten (`formInput`, `addButton`, `backButton`)
6. `Loader.vue`, `NotificationBar.vue`
7. `Navbar.vue`, `BottomBar.vue`
8. Modals: `deleteModal`, `ShareListModal`, `DeleteListModal`, `DeactivateAccountModal`
9. Auth pagina's: `login`, `register`, `password/reset`, `password/[id]`, `[id]`
10. `pages/index.vue` (Dashboard)
11. `pages/list/[id].vue` + list/ componenten
12. Profiel pagina's + sub-componenten
13. Cards pagina's + `CardUploadPanel`
14. Admin pagina's + sub-componenten
15. `information.vue`, `terms/index.vue`, `terms/approve.vue`

---

## Wat NIET verandert

- `v-model` bindings
- `@click`, `@submit`, `@input`, `@change` event handlers
- `v-if`, `v-show`, `v-for` condities
- PrimeVue component types (zelfde componenten, wel `unstyled` verwijderd)
- i18n vertalingen
- API calls, store logica, composables
- Props en emits interfaces
- CSS classes/attributen gebruikt als JavaScript of test selectors (`data-*`, `querySelector` targets)
- PrimeVue `pt` keys die ARIA roles of interne gedragsstates aansturen

---

## Risico's

| Risico | Mitigatie |
|---|---|
| `unstyled` verwijderen breekt layout | Per component testen in browser direct na wijziging |
| `pt` structural keys per ongeluk verwijderd | Alleen kleur/border/achtergrond pt-overrides verwijderen |
| Kleurcontrast op lichte achtergrond | Controleren op WCAG AA voor alle tekstvarianten |
| Chart.js kleuren hardcoded in data arrays | Expliciet updaten per chart component (3 componenten) |
| Mobile BottomBar na stijlwijziging | Testen op klein scherm na stap 7 |
| `Dialog` vervanging breekt modal open/close logica | `:visible` / `v-model:visible` binding overnemen uit bestaande implementatie |

---

## Buiten scope

- Animaties of transities wijzigen
- HTML structuur wijzigen anders dan card-wrappers toevoegen
- Vertalingen aanpassen
- Functionaliteit toevoegen of verwijderen
- Dark mode toggle implementeren
- Nieuwe routes of pagina's toevoegen
