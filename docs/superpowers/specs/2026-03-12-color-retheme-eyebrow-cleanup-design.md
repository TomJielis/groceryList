# Design: Color Retheme + Eyebrow Cleanup

**Date:** 2026-03-12
**Branch:** feature/business-styling

## Problem

Two patterns made the UI read as AI-generated / generic SaaS template:

1. **Navy + orange color scheme** — `#1e3a5f` navbar with `#f97316` orange is one of the most overused combinations in AI-designed interfaces.
2. **Repeated eyebrow text** — every section on every page uses `<p class="page-eyebrow">grocery list</p>`, which repeats the app name endlessly and adds no information.

## Changes

### 1. Color Retheme: Dark Forest + Sage

Replace the navy/orange palette with a dark forest green navbar and sage green accent. The green connects naturally to grocery/food context without being on-the-nose.

**CSS variables (`assets/css/app-theme.css`):**
- `--app-navy`: `#1e3a5f` → `#1c2b2b`
- `--app-navy-dark`: `#16304f` → `#152121`
- `--app-bg`: `#f0f4f8` → `#f4f6f3`
- `--app-bg-auth`: `#e8ecf2` → `#edf0ec`

**Body background (`assets/css/main.css`):**
- `background: #f3f4f6` → `#f4f6f3`

**PrimeVue theme preset (`assets/theme/business.ts`):**

Replace the orange primary scale with a sage green scale:
- 50: `#f0fdf4`, 100: `#dcfce7`, 200: `#bbf7d0`, 300: `#86efac`, 400: `#4ade80`, 500: `#5ebd8a`, 600: `#16a34a`, 700: `#15803d`, 800: `#166534`, 900: `#14532d`, 950: `#052e16`

Primary color tokens:
- `color`: `#5ebd8a`
- `contrastColor`: `#ffffff`
- `hoverColor`: `#4aad78`
- `activeColor`: `#3a9a66`

Highlight tokens:
- `background`: `#e8f5ee`
- `focusBackground`: `#d1edd9`
- `color`: `#276749`
- `focusColor`: `#1e5239`

Checkbox:
- `checkedBackground`: `#1c2b2b`
- `checkedBorderColor`: `#1c2b2b`
- `checkedHoverBackground`: `#152121`

InputText/Select focus border: `#1e3a5f` → `#1c2b2b`

Progress bar value: follows `{primary.color}` — no change needed.

### 2. Eyebrow Cleanup: Remove All

Strip every `<p class="page-eyebrow">...</p>` element from all pages and components. The `.page-eyebrow` CSS class definition stays in `app-theme.css` (harmless, no visual impact).

**Affected files (16 total):**
- `pages/index.vue`
- `pages/information.vue`
- `pages/cards/index.vue`
- `pages/terms/index.vue`
- `pages/terms/approve.vue`
- `pages/admin/index.vue`
- `pages/admin/top-items.vue`
- `pages/admin/users/index.vue`
- `pages/admin/users/[id].vue`
- `pages/profile/index.vue`
- `pages/profile/stats.vue`
- `pages/list/[id].vue`
- `components/list/AddItemListForm.vue`
- `components/list/SharedUsersList.vue`
- `components/list/ListForm.vue`
- `components/list/PendingGroceryList.vue`

## Out of Scope

- No layout changes
- No typography changes
- No component restructuring
- No new features
