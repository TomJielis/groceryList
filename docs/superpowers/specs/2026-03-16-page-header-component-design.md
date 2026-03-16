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
<PageHeader back-to="/profile" title="Statistieken" subtitle="Optionele subtitel">
  <template #actions>
    <!-- optional right-side content -->
  </template>
</PageHeader>
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `backTo` | `string` | yes | Route for the back navigation link |
| `title` | `string` | yes | Page title shown to the right of the back button |
| `subtitle` | `string` | no | Optional secondary line below the title |

### Slot

- `#actions` — optional slot for right-side content (buttons, selectors). Rendered only when provided.

## Visual Design

Based on the existing admin pages (the most complete implementation):

- **Back button:** `w-9 h-9`, `border border-surface-200`, `rounded`, `text-color-secondary`, hover: `hover:border-surface-400 hover:text-color`, `transition`
- **Icon:** chevron-left SVG, `w-4 h-4`
- **Layout:** `flex items-center justify-between gap-4 py-4 border-b border-surface-200`
- **Title:** `page-heading truncate` (existing CSS class)
- **Subtitle:** `text-sm text-color-secondary`
- **Left group:** `flex items-center gap-3 min-w-0` (allows title to truncate on small screens)

## Pages Updated

| Page | Change | Actions slot |
|---|---|---|
| `pages/profile/stats.vue` | Replace custom header div | No |
| `pages/admin/index.vue` | Replace custom header div | Yes (MonthSelector) |
| `pages/admin/users/[id].vue` | Replace custom header div | No (subtitle = user email) |
| `pages/list/[id].vue` | Replace stacked layout (back above title) with inline layout | Yes (add item button) |

## Out of Scope

- Auth pages (login, register, password reset) — use full-width card-based navigation, intentionally different
- `components/form/backButton.vue` — fixed bottom button for form flows, not a page header
- `pages/terms/` — no small icon back button present
