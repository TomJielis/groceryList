# Design: PageHeader Component

**Date:** 2026-03-16
**Branch:** feature/business-styling

## Problem

Four pages use a small icon-style back button, but each has a slightly different implementation:

- `pages/profile/stats.vue` — `w-8 h-8`, no border, title inline
- `pages/admin/index.vue` — `w-9 h-9`, border, title inline
- `pages/admin/users/[id].vue` — `w-9 h-9`, border, title inline
- `pages/list/[id].vue` — `w-10 h-10`, border, but title stacked **below** the button (not inline)

The inconsistency is visible on mobile: buttons appear at different sizes and positions relative to the title.

## Solution

Create a single reusable `components/PageHeader.vue` component and replace the header section on all four pages.

## Component API

```vue
<PageHeader back-to="/profile" title="Statistieken" :subtitle="dynamicValue">
  <template #actions>
    <!-- optional right-side content (buttons, selectors) -->
  </template>
</PageHeader>
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `backTo` | `string` | yes | Static route string for the back navigation link. Programmatic navigation (`router.back()`) is out of scope — all four target pages use static routes. |
| `title` | `string` | yes | Page title shown to the right of the back button |
| `subtitle` | `string` | no | Optional secondary line below the title. Can be a dynamic/conditional binding (e.g. `:subtitle="data?.period"`) |

### Slot

- `#actions` — optional slot for right-side content. On mobile, actions render below the button+title row. On desktop (`md:` breakpoint), they align to the right on the same row.

### Accessibility

The back button is icon-only. It must include an `aria-label` bound to the existing i18n key `common.back` via `useI18nStore`.

### Title truncation

The component root element must be `w-full` and the left group must use `min-w-0` to allow the `truncate` class on the title to function correctly. Tailwind's `truncate` requires all ancestors to have bounded widths.

## Layout (responsive)

```
Mobile:
┌─────────────────────────────┐
│ [←]  Page Title             │
│      subtitle               │
│                             │
│ [actions if present]        │
└─────────────────────────────┘

Desktop (md+):
┌─────────────────────────────┐
│ [←]  Page Title    [actions]│
│      subtitle               │
└─────────────────────────────┘
```

Implemented with: `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`

## Visual Design

Based on the existing admin pages (the most complete implementation):

- **Back button:** `w-9 h-9`, `border border-surface-200`, `rounded`, `text-color-secondary`, hover: `hover:border-surface-400 hover:text-color`, `transition`, `flex-shrink-0`
- **Icon:** chevron-left SVG, `w-4 h-4`
- **Separator line:** `border-b border-surface-200` on the component's outer wrapper — **this adds a bottom border to `stats.vue` and `list/[id].vue` which do not currently have one. This is an intentional visual change to unify the header style.**
- **Vertical padding:** `py-4`
- **Title:** `page-heading truncate` (existing CSS class)
- **Subtitle:** `text-sm text-color-secondary`, only rendered when prop is provided

## Pages Updated

| Page | Back target | Subtitle | Actions slot |
|---|---|---|---|
| `pages/profile/stats.vue` | `/profile` | none | No |
| `pages/admin/index.vue` | `/profile` | `statsActivity.current_month.period` (dynamic, conditional) | Yes — `MonthSelector` (`w-full md:w-64`) |
| `pages/admin/users/[id].vue` | `/admin/users` | `data?.user?.email` (dynamic) | No |
| `pages/list/[id].vue` | `/` | `uncheckedItems.length remaining · checkedItems.length done` (dynamic) | Yes — add item `Button` |

### Note on `list/[id].vue`

The list page header currently contains more than just the back button and title — it also has a stats row (stat cards) and a `ProgressBar`. The `PageHeader` component replaces **only the top row** (back button + title + subtitle + actions). The stats row and progress bar remain as page-specific content below the `PageHeader`.

## Out of Scope

- Auth pages (login, register, password reset) — use full-width card-based navigation, intentionally different
- `components/form/backButton.vue` — fixed bottom button for form flows, not a page header
- `pages/terms/` — no small icon back button present
